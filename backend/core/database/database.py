from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from create_database import create_db
from sqlalchemy.ext.declarative import declarative_base

url = create_db()
engine = create_engine(url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()