from typing import List
from fastapi import APIRouter, Depends
from schemas.animal import AnimalCreate,AnimalResponse
from sqlalchemy.ext.asyncio import AsyncSession
from services.animal_service import AnimalService
from core.database.connect import get_bd

animal_router = APIRouter()

@animal_router.get("/",summary="Lista animais cadastrados",response_model=List[AnimalResponse])
async def list_animals(db: AsyncSession = Depends(get_bd)):
    return await AnimalService.list_animals(db)

@animal_router.post("/create",summary="Cadastra um novo animal",response_model=AnimalResponse)
async def create_animal(animal:AnimalCreate, db: AsyncSession = Depends(get_bd)):
    return await AnimalService.create_animal(db,animal)