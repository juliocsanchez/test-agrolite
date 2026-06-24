from contextlib import asynccontextmanager
from core.database.connect import create_tables
from api.router import router
from fastapi import FastAPI
import models

@asynccontextmanager
async def lifespan(app:FastAPI):
    await create_tables()
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(router=router)

@app.get("/")
def hello():
    return{
        "msg" : "Bem-vindo a API agrolite_management"
    }
