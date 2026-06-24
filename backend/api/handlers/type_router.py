from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from services.type_service import ManagementTypeService
from core.database.connect import get_bd
from schemas.management_type import ManagementTypeCreate, ManagementTypeUpdate, ManagementTypeResponse

types_router = APIRouter()

@types_router.get("/",summary="Tipos de manejamento cadastrados",response_model=List[ManagementTypeResponse])
async def read_types(db:AsyncSession = Depends(get_bd)):
    return await ManagementTypeService.read(db)

@types_router.post("/create",summary="Cria um tipo de manejamento",response_model=ManagementTypeResponse)
async def create_type(management_type:ManagementTypeCreate,db:AsyncSession = Depends(get_bd)):
    return await ManagementTypeService.create(db,management_type)

@types_router.put("/{id}",summary="Atualiza um tipo de manejamento",response_model=ManagementTypeResponse)
async def update_type(management_type: ManagementTypeUpdate,type_id:int,db:AsyncSession = Depends(get_bd)):
    return await ManagementTypeService.update(db,type_id,management_type)

@types_router.delete("/{id}",summary="Deleta um tipo de manejamento")
async def delete_type(type_id:int,db:AsyncSession = Depends(get_bd)):
    return await ManagementTypeService.delete(db,type_id)