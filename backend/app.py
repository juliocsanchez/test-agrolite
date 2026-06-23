from contextlib import asynccontextmanager
from core.database.create_database import create_db
from api.router import router
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app:FastAPI):
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(router=router)

