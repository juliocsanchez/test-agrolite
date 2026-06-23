import asyncio
import sys
from core.database.create_database import create_db

async def main():
    await create_db()

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.run(main(), loop_factory=asyncio.SelectorEventLoop)
    else:
        asyncio.run(main())