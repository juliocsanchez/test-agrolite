from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from core.database.connect import get_bd
from services.management import ManagementEventService
from schemas.management_event import ManagementEventBase, ManagementEventResponse

event_router = APIRouter()

@event_router.get("/",summary="Lista manejos cadastrados",response_model=List[ManagementEventResponse])
async def list_events(db:AsyncSession = Depends(get_bd)):
    return await ManagementEventService.read(db)

@event_router.post("/create",summary="Cria novo manejo ",response_model=ManagementEventResponse)
async def create_events(management_event: ManagementEventBase, db:AsyncSession = Depends(get_bd)):
    return await ManagementEventService.create(db,management_event)

@event_router.put("/{id}",summary="Atualiza manejo ",response_model=ManagementEventResponse)
async def update_events(management_event: ManagementEventBase,id:int, db:AsyncSession = Depends(get_bd)):
    return await ManagementEventService.update(db,id,management_event)

@event_router.delete("/{id}",summary="Deleta manejo ")
async def delete_events(id:int, db:AsyncSession = Depends(get_bd)):
    return await ManagementEventService.delete(db,id)
