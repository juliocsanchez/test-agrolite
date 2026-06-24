from fastapi import HTTPException, status
from models.management_event import ManagementEvent
from schemas.management_event import ManagementEventCreate, ManagementEventResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

class ManagementEventService:

    @staticmethod
    async def list_events(db:AsyncSession):
         query = select(ManagementEvent)
         result = await db.execute(query)
         return result.scalars().all()

    @staticmethod
    async def create_event(db: AsyncSession, event: ManagementEventCreate):
        try:
            new_event = ManagementEvent(**event.model_dump())
            db.add(new_event)
            await db.commit()
            await db.refresh(new_event)
            return new_event
        
        except IntegrityError as e:
               await db.rollback()
               error = e.orig
               if error:    
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=f"Erro: {getattr(error,"detail",str(error))}")
               raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Evento já cadastrado")
        
#@TODO update e delete