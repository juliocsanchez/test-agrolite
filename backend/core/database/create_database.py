from sqlalchemy_utils import database_exists, create_database
import os
from dotenv import load_dotenv

def create_db():
    load_dotenv()
    url_database = os.getenv("DATABASE_URL",)

    if not database_exists(url_database):
        create_database(url_database)
        print("Banco criado com sucesso!")
    
    return url_database

