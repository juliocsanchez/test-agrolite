from contextlib import asynccontextmanager
from core.database.connect import create_tables
from api.router import router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models

@asynccontextmanager
async def lifespan(app:FastAPI):
    await create_tables()
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(router=router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def hello():
    return{
        "msg" : "Bem-vindo a API agrolite_management"
    }
