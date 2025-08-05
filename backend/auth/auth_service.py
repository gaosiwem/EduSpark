import random
import string
from datetime import datetime, timedelta

from fastapi import Depends
from sqlalchemy import select, update, insert
from sqlalchemy.ext.asyncio import AsyncSession

from passlib.hash import bcrypt
from database.db import get_async_session
from database.models import User, VerificationCode

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Password helpers
def hash_password(password: str) -> str:
    return bcrypt.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.verify(password, password_hash)


# Code generator
def generate_verification_code(length=6) -> str:
    return ''.join(random.choices(string.digits, k=length))


# Get user by email
async def get_user_by_email(email: str, session: AsyncSession):
    result = await session.execute(select(User).where(User.email == email))
    return result.scalars().first()


# Create new user
async def create_user(
    email: str,
    session: AsyncSession,
    password: str = "",
    is_verified: bool = False,
    provider: str = "local",
    social_id: str = "",
    
):
    user = User(
        email=email,
        is_verified=is_verified,
        provider=provider,
        social_id=social_id,
        created_at=datetime.now()
    )

    # If local password is provided
    if password:
        user.password_hash = hash_password(password)

    session.add(user)
    await session.commit()
    await session.refresh(user)

    code = ""
    if password:
        code = generate_verification_code()
        expires_at = datetime.now() + timedelta(minutes=10)
        verification = VerificationCode(
            user_id=user.id,
            code=code,
            expires_at=expires_at
        )
        session.add(verification)
        await session.commit()

    logger.info(f"User registered: {email}")
    return {"user_id": user.id, "verification_code": code}


# Verify email using code
async def verify_user_email(email: str, code: str, session: AsyncSession):
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        return False

    result = await session.execute(
        select(VerificationCode).where(
            VerificationCode.user_id == user.id,
            VerificationCode.code == code,
            VerificationCode.expires_at > datetime.utcnow()
        )
    )
    verification = result.scalars().first()
    if not verification:
        return False

    await session.execute(
        update(User)
        .where(User.id == user.id)
        .values(is_verified=True)
    )
    await session.commit()
    logger.info(f"Email verified: {email}")
    return True


# Login user
async def login_user(email: str, password: str, session: AsyncSession):
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if user and verify_password(password, user.password_hash):
        logger.info(f"User logged in: {email}")
        return user
    return None


# Reset password
async def reset_password(email: str, password: str, session: AsyncSession):
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        return None

    new_hash = hash_password(password)

    await session.execute(
        update(User)
        .where(User.id == user.id)
        .values(password_hash=new_hash)
    )
    await session.commit()

    logger.info(f"Password reset for user: {email}")
    return True
