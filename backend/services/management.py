from fastapi import HTTPException, status
from models.management_event import ManagementEvent
from schemas.management_event import ManagementEventBase, ManagementEventHistory, ManagementEventResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
from sqlalchemy import select

class ManagementEventService:

    @staticmethod
    async def create(db: AsyncSession, event: ManagementEventBase):
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
               
    @staticmethod
    async def read(db: AsyncSession):
        query = (
            select(ManagementEvent)
            .options(joinedload(ManagementEvent.type))
            .options(joinedload(ManagementEvent.animal))
        )
        result = await db.execute(query)
        events = result.scalars().all()

        return [
            ManagementEventHistory(
                id=event.id,
                type_id = event.type.id,
                animal_id= event.animal.id,
                type_name=event.type.type_name,
                animal_code = event.animal.code,
                management_date=event.management_date,
                description=event.type.description,
                days_interval=event.type.days_interval,
                photo_url=event.photo_url,
            )
            for event in events
    ]
        
    @staticmethod
    async def update(db:AsyncSession,id:int,event: ManagementEventBase):
        query = select(ManagementEvent).where(ManagementEvent.id == id)
        res = await db.execute(query)
        management_db = res.scalars().first()

        if management_db is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Manejamento não encontrado no banco de dados")
        
        event_update = event.model_dump()
        for keys,values in event_update.items():
            setattr(management_db,keys,values)

        await db.commit()
        await db.refresh(management_db)
        
        return management_db
    
    @staticmethod
    async def delete(db:AsyncSession,id:int):
        query = select(ManagementEvent).where(ManagementEvent.id == id)
        res = await db.execute(query)
        management_db = res.scalars().first()

        if management_db is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Manejo não encontrado no banco")
        
        await db.delete(management_db)
        await db.commit()

        return HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="Manejo Excluído")