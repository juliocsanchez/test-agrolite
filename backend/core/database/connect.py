from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from sqlalchemy.ext.declarative import declarative_base
import os

load_dotenv()
url = os.getenv("DATABASE_URL")
url_driver = make_url(url)._replace(drivername="postgresql+asyncpg")
engine = create_async_engine(url_driver)
session = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()