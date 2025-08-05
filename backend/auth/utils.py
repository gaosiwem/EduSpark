from typing import Optional
from jose import jwt
import random
import string
from datetime import datetime, timedelta
import os

SECRET_KEY = repr(os.getenv("SECRET_KEY"))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REMEMBER_ME_EXPIRE_DAYS = 30 # How long the remember me cookie should last
REMEMBER_ME_COOKIE_NAME = "remember_me_token"
REMEMBER_ME_SECRET_KEY = repr(os.getenv("REMEMBER_ME_SECRET_KEY")) 


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, str(REMEMBER_ME_SECRET_KEY), algorithm=ALGORITHM) # Use the provided secret_key
    return encoded_jwt

def generate_verification_code(length=6):
    return ''.join(random.choice(string.digits, k = length))