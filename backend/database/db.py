
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Use asyncpg for PostgreSQL
# e.g., DATABASE_URL = "postgresql+asyncpg://user:pass@localhost:5432/dbname"
engine = create_async_engine(DATABASE_URL, echo=True)

# Create session factory
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Declare Base for models
Base = declarative_base()

# Dependency for FastAPI routes
async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
