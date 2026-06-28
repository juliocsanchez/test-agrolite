from typing import List
from fastapi import APIRouter, Depends
from schemas.management_event import ManagementEventAnimalHistory, ManagementEventHistory
from schemas.animal import AnimalCreate,AnimalResponse, AnimalUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from services.animal_service import AnimalService
from core.database.connect import get_bd

animal_router = APIRouter()

@animal_router.get("/",summary="Lista animais cadastrados",response_model=List[AnimalResponse])
async def list_animals(db: AsyncSession = Depends(get_bd)):
    return await AnimalService.read(db)

@animal_router.get("/history/{id}", summary="Lista de manejos por animal",response_model=List[ManagementEventAnimalHistory])
async def get_history(id:int,db: AsyncSession = Depends(get_bd)):
    return await AnimalService.history(db,id)

@animal_router.post("/create",summary="Cadastra um novo animal",response_model=AnimalResponse)
async def create_animal(animal:AnimalCreate, db: AsyncSession = Depends(get_bd)):
    return await AnimalService.create(db,animal)

@animal_router.put("/{id}",summary = "Atualiza um animal",response_model=AnimalResponse)
async def update_animal(animal:AnimalUpdate,animal_id:int, db: AsyncSession = Depends(get_bd)):
    return await AnimalService.update(db,animal,animal_id)

@animal_router.delete("/{id}",summary = "Deleta um animal")
async def delete_animal(id:int, db: AsyncSession = Depends(get_bd)):
    return await AnimalService.delete(db,id)