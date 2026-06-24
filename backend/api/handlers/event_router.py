from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from core.database.connect import get_bd
from services.event_service import ManagementEventService
from schemas.management_event import ManagementEventCreate, ManagementEventResponse

event_router = APIRouter()

@event_router.get("/",summary="Lista manejos cadastrados",response_model=List[ManagementEventResponse])
async def list_events(db:AsyncSession = Depends(get_bd)):
    return await ManagementEventService.list_events(db)

@event_router.post("/create",summary="Cria novo manejo ",response_model=ManagementEventResponse)
async def list_events(management_event: ManagementEventCreate, db:AsyncSession = Depends(get_bd)):
    return await ManagementEventService.create_event(db,management_event)