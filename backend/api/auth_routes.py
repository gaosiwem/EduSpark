from fastapi import APIRouter, HTTPException, Depends, status, Request, Response
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database.db import get_async_session
from schema_models.schema import UserCreate, UserLogin, EmailVerification, TokenResponse
from auth.utils import (ACCESS_TOKEN_EXPIRE_MINUTES, 
                        ALGORITHM, SECRET_KEY, 
                        create_access_token, generate_verification_code,
                        REMEMBER_ME_COOKIE_NAME,REMEMBER_ME_EXPIRE_DAYS, REMEMBER_ME_SECRET_KEY
                        )
from auth.auth_service import get_user_by_email, create_user, login_user, verify_user_email, reset_password
from pydantic import BaseModel
import random
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from authlib.integrations.starlette_client import OAuth
import os
import json
from sqlalchemy.ext.asyncio import AsyncSession
import httpx


from flask import Flask, request, jsonify
from flask_cors import CORS # Import Flask-CORS

app = Flask(__name__)
# Enable CORS for all routes (for development purposes to avoid browser CORS errors)
# In a production environment, you would restrict this to specific origins.
CORS(app, resources={r"/*": {"origins": "*"}})

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

class RegisterData(BaseModel):
    email: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

class VerifyEmail(BaseModel):
    email: str
    code: str
    
# In-memory token blacklist for demonstration (use Redis or DB in production)
token_blacklist = set()


# --- JWT Token endpoints ---
@router.post("/api/token", response_model=TokenResponse)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await login_user(form_data.username, form_data.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    
    elif not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified.")
    
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/api/register")
async def register(data: RegisterData, session: AsyncSession = Depends(get_async_session)):
    user = await get_user_by_email(data.email, session)
    print(user)
    
    if(user):
        raise HTTPException(status_code=400, detail="User already exists.")
    else:
        created_user = await create_user(data.email, session, data.password)
        
    return created_user

@router.post("/api/login")
async def login(data: LoginData, response: Response, session: AsyncSession = Depends(get_async_session)):
    
    user = await login_user(data.email, data.password, session)
    
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    elif not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified.")
    
    remember_me_token = create_access_token(
        data={"sub": user.email},
        expires_delta = timedelta(days=REMEMBER_ME_EXPIRE_DAYS)
    )
    
    response.set_cookie(
        key = REMEMBER_ME_COOKIE_NAME,
        value = remember_me_token,
        httponly = True,
        secure = False, # Should be True in production (HTTPS)
        samesite = "Lax",
        max_age = int(timedelta(days=REMEMBER_ME_EXPIRE_DAYS).total_seconds())
    )
    
    # Issue a short-lived access token for immediate use
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {"access_token": access_token, "token_type": "bearer", "email": user.email}

@router.post("/api/verify-email")
async def verify_code(data: VerifyEmail, session: AsyncSession = Depends(get_async_session)):
    return await verify_user_email(data.email, data.code, session)

@router.post("/api/forgot-password")
async def forgot_password(data: LoginData, session: AsyncSession = Depends(get_async_session)):
    return await reset_password(data.email, data.password, session)


def get_current_user(token: str = Depends(oauth2_scheme)):
    if token in token_blacklist:
        raise HTTPException(status_code=401, detail="Token revoked.")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token.")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")
      
@router.get("/api/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    user = await get_user_by_email(current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"email": user.email, "is_verified": user.is_verified, "role": user.role}

@router.post("/api/logout")
async def logout(response: Response, token: str = Depends(oauth2_scheme)):
    token_blacklist.add(token)
    # Also remove the "remember me" cookie on logout
    response.delete_cookie(key=REMEMBER_ME_COOKIE_NAME, httponly=True, secure=True, samesite="Lax")
    
    return {"msg": "Logged out successfully"}

# --- OAuth2 Setup---

oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_WEB_GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo', # Or https://openidconnect.googleapis.com/v1/userinfo
    client_kwargs={'scope': 'openid email profile'}
)

oauth.register(
    name='facebook',
    client_id=os.getenv("FACEBOOK_CLIENT_ID"),
    client_secret=os.getenv("FACEBOOK_CLIENT_SECRET"),
    access_token_url='https://graph.facebook.com/v10.0/oauth/access_token',
    access_token_params=None,
    authorize_url='https://www.facebook.com/v10.0/dialog/oauth',
    authorize_params=None,
    api_base_url='https://graph.facebook.com/v10.0/',
    client_kwargs={'scope': 'email'}
)

# --- OAuth Endpoints ---
@router.post('/api/login/google-mobile')
async def login_google_mobile(request: Request):
    data = await request.json()
    id_token = data.get("idToken")

    if not id_token:
        raise HTTPException(status_code=400, detail="Missing Google ID token.")

    # Verify the ID token with Google
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google ID token.")
        token_info = resp.json()

    email = token_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no public email.")

    # Look up or create user
    user = await get_user_by_email(email)
    if not user:
        user = await create_user(email, None, is_verified=True, provider="google", social_id=token_info.get("sub"))

    remember_me_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(days=REMEMBER_ME_EXPIRE_DAYS)
    )

    access_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": email,
        "remember_me_token": remember_me_token
    }


@router.get('/api/login/google')
async def login_google(request: Request):
    redirect_uri = str(request.url_for('auth_google_callback'))
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/api/auth/google/callback')
async def auth_google_callback(request: Request, response: Response):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    email = user_info.get("email") if user_info else None

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no public email.")

    user = await get_user_by_email(email)
    if not user:
        user = await create_user(email, None, is_verified=True, provider="google", social_id=user_info.get("sub"))

    remember_me_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(days=REMEMBER_ME_EXPIRE_DAYS)
    )

    response.set_cookie(
        key=REMEMBER_ME_COOKIE_NAME,
        value=remember_me_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=int(timedelta(days=REMEMBER_ME_EXPIRE_DAYS).total_seconds())
    )

    access_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    redirect_url = (
        f"{os.getenv('FRONTEND_BASE_URL')}/login/callback"
        f"?access_token={access_token}"
        f"&token_type=bearer"
        f"&email={email}"
    )
    return RedirectResponse(url=redirect_url, status_code=status.HTTP_302_FOUND)

@router.get("/api/login/facebook")
async def login_facebook(request: Request):
    redirect_uri = str(request.url_for('auth_facebook_callback'))
    return await oauth.facebook.authorize_redirect(request, redirect_uri)

@router.get("/api/auth/facebook/callback", response_model=TokenResponse) # Added response_model
async def auth_facebook_callback(request: Request, response: Response): # Add Response parameter
    token = await oauth.facebook.authorize_access_token(request)
    resp = await oauth.facebook.get('me?fields=id,name,email', token=token)
    user_info = resp.json()
    email = user_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Facebook account has no public email.")
    user = await get_user_by_email(email)
    if not user:
        user = await create_user(email, None, is_verified=True, provider = "facebook", social_id = 2)

    # Generate and set "remember me" cookie for Facebook too
    remember_me_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(days=REMEMBER_ME_EXPIRE_DAYS)
    )
    response.set_cookie(
        key=REMEMBER_ME_COOKIE_NAME,
        value=remember_me_token,
        httponly=True,
        secure=True, # IMPORTANT: Set to True in production with HTTPS
        samesite="Lax",
        max_age=int(timedelta(days=REMEMBER_ME_EXPIRE_DAYS).total_seconds())
    )

    access_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "email": email}


async def get_remembered_user_email(request: Request) -> Optional[str]:
    """
    Extracts and validates the remember me token from cookies.
    Returns the user's email if valid, otherwise None.
    """
    remember_me_token = request.cookies.get(REMEMBER_ME_COOKIE_NAME)
    if not remember_me_token:
        return None

    try:
        payload = jwt.decode(remember_me_token, REMEMBER_ME_SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        # You could also add a check here to ensure the user exists in DB
        # user = await get_user_by_email(email)
        # if not user:
        #     return None
        return email
    except JWTError:
        # Token is invalid or expired
        return None

@router.get("/api/check-session", response_model=TokenResponse, tags=["Authentication"])
async def check_session(request: Request, response: Response):
    """
    Checks for a valid 'remember me' cookie and re-issues a new access token if found.
    """
    remembered_email = await get_remembered_user_email(request)

    if remembered_email:
        user = await get_user_by_email(remembered_email)
        if not user or not user.is_verified:
            # If user not found or not verified, invalidate the cookie
            response.delete_cookie(key=REMEMBER_ME_COOKIE_NAME, httponly=True, secure=True, samesite="Lax")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Remembered user not found or not verified.")

        # If remembered user is valid, issue a new short-lived access token
        access_token = create_access_token(
            data={"sub": remembered_email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {"access_token": access_token, "token_type": "bearer", "email": remembered_email}
    else:
        # No valid remember me token found
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No active session.")




