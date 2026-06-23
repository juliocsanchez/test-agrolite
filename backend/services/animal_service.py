from fastapi import HTTPException, status
from models.animal import Animal
from schemas.animal import AnimalCreate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

class AnimalService:

    @staticmethod
    async def create_animal(db:AsyncSession, animal: AnimalCreate):
          try:
            new_animal = Animal(**animal.model_dump())
            db.add(new_animal)
            await db.commit()
            await db.refresh(new_animal)
            return new_animal
          
          except IntegrityError:
               await db.rollback()
               raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Animal com código já cadastrado")

    @staticmethod
    async def list_animals(db: AsyncSession):
            query = select(Animal)
            result = await db.execute(query)
            return result.scalars().all()