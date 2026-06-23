from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from sqlalchemy.orm import declarative_base
import os

load_dotenv()

url = os.getenv("DATABASE_URL")
engine = create_async_engine(url)
session = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

async def create_tables():
    import models
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_bd():
    async with session() as db:
        yield db