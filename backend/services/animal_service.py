from fastapi import HTTPException, status
from schemas.management_event import ManagementEventHistory
from models.management_event import ManagementEvent
from models.animal import Animal
from schemas.animal import AnimalCreate, AnimalUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
from sqlalchemy import select

class AnimalService:

    @staticmethod
    async def create(db:AsyncSession, animal: AnimalCreate):
          try:
            new_animal = Animal(**animal.model_dump())
            db.add(new_animal)
            await db.commit()
            await db.refresh(new_animal)
            return new_animal
          
          except IntegrityError:
               await db.rollback()
               raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Animal já cadastrado")

    @staticmethod
    async def read(db: AsyncSession):
            query = select(Animal)
            result = await db.execute(query)
            return result.scalars().all()
    
    @staticmethod
    async def update(db:AsyncSession,animal: AnimalUpdate,id:int):
         query = select(Animal).where(Animal.id == id)
         res = await db.execute(query)
         db_animal =  res.scalars().first()

         if db_animal is None:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Animal não encontrado no banco de dados")

         update_animal = animal.model_dump(exclude_unset=True)
         for key,value in update_animal.items():
              setattr(db_animal,key,value)

         await db.commit()
         await db.refresh(db_animal)

         return db_animal
    
    @staticmethod
    async def delete(db:AsyncSession, id: int):
         query = select(Animal).where(Animal.id == id)
         res = await db.execute(query)
         animal = res.scalars().first()

         if animal == None:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Animal não encontrado no banco")

         await db.delete(animal)
         await db.commit()
         
         return HTTPException(status_code=status.HTTP_204_NO_CONTENT,detail="Animal deletado com sucesso")
         
    @staticmethod
    async def history(db:AsyncSession,id:int):
     query = (
          select(ManagementEvent)
          .options(joinedload(ManagementEvent.type)) 
          .where(ManagementEvent.animal_id == id)
     )
     res = await db.execute(query)
     events = res.scalars().all()

     return [
          ManagementEventHistory(
               id=event.id,
               type_name=event.type.type_name,  
               management_date=event.management_date,
               description=event.description,
               photo_url=event.photo_url,
          )
          for event in events
     ]