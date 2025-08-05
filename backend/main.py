from fastapi import FastAPI
from api.routes import router
import logging
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware  
from fastapi.staticfiles import StaticFiles

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
print("Starting FastAPI application...")

# Serve files in the "uploads" directory at the "/uploads" path
app.mount("/uploads", StaticFiles(directory="/app/uploads"), name="uploads")

app.add_middleware(SessionMiddleware, secret_key="your-very-secret-session-key")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.11.114:3000", "http://192.168.11.114:8004"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# import sentry_sdk
# sentry_sdk.init(dsn="your_sentry_dsn", traces_sample_rate=1.0)