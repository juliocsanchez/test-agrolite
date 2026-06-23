from psycopg import AsyncConnection
from dotenv import load_dotenv
from psycopg.errors import DuplicateDatabase
import os

async def create_db():
    load_dotenv()
    base_url = os.getenv("BASE_URL")

    try:
        async with await AsyncConnection.connect(base_url, autocommit=True) as conn:
            db_name = os.getenv('DATABASE_NAME')
            await conn.execute(f'CREATE DATABASE {db_name}')
            print(f"Banco {db_name} criado!")

    except DuplicateDatabase:
       print("Banco já existe")

    except Exception as e:
        print(f"Erro ao criar banco de dados :{e}")