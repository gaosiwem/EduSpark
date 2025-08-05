import datetime
from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import XPBadge, XPGamifiedProfile, XPQuizAttempt, XPUserBadge
from database.db import get_async_session


def calculate_level(xp: int) -> int:
    return (xp // 100) + 1

async def add_xp(user_id: int, xp_to_add: int, session: AsyncSession):
    result = await session.execute(
        select(XPGamifiedProfile).where(XPGamifiedProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()

    if not profile:
        profile = XPGamifiedProfile(user_id=user_id, xp=0, level=1, streak=0)
        session.add(profile)
        await session.commit()
        await session.refresh(profile)

    # Streak calculation
    today = datetime.utcnow().date()
    yesterday = today - datetime.timedelta(days=1)

    if profile.last_login_date == yesterday:
        profile.streak += 1
    elif profile.last_login_date != today:
        profile.streak = 1  # reset if missed a day or first login

    profile.xp += xp_to_add
    new_level = calculate_level(profile.xp)
    if new_level > profile.level:
        profile.level = new_level

    profile.last_login_date = today
    await session.commit()
    await session.refresh(profile)

    await check_and_award_badges(user_id, profile.xp, profile.streak, session)

    return {
        "xp": profile.xp,
        "level": profile.level,
        "streak": profile.streak,
        "xp_to_next_level": ((profile.level + 1) * 100) - profile.xp,
    }


async def check_and_award_badges(user_id: int, xp: int, streak: int, session: AsyncSession):
    badge_criteria = {
        "first_quiz": xp >= 50,
        "xp_100": xp >= 100,
        "xp_500": xp >= 500,
        "7_day_streak": streak >= 7,
        "14_day_streak": streak >= 14,
    }

    result = await session.execute(
        select(XPUserBadge.badge_id).where(XPUserBadge.user_id == user_id)
    )
    earned_badge_ids = {b[0] for b in result.fetchall()}

    result = await session.execute(select(XPBadge))
    all_badges = result.scalars().all()

    for badge in all_badges:
        if badge.criteria in badge_criteria and badge_criteria[badge.criteria]:
            if badge.id not in earned_badge_ids:
                new_user_badge = XPUserBadge(user_id=user_id, badge_id=badge.id)
                session.add(new_user_badge)
                await session.commit()

async def save_quiz_attempt(user_id: int, quiz_data: dict, session: AsyncSession):
    
    attempt = XPQuizAttempt(
        user_id=user_id,
        grade=quiz_data["grade"],
        subject=quiz_data["subject"],
        score=quiz_data["score"],
        total_questions=quiz_data["total_questions"],
        correct_answers=quiz_data["correct_answers"],
        questions=quiz_data["questions"]
    )
    
    session.add(attempt)
    await session.commit()
    await session.refresh(attempt)
    return attempt