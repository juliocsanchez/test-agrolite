from fastapi import HTTPException,status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from schemas.management_type import ManagementTypeCreate, ManagementTypeUpdate
from models.management_type import ManagementType

class ManagementTypeService:

    @staticmethod
    async def read(db: AsyncSession):
        query = select(ManagementType)
        res = await db.execute(query)
        return res.scalars().all()
    

    @staticmethod
    async def create(db:AsyncSession, type_manegement:ManagementTypeCreate):
        try:
            new_type = ManagementType(**type_manegement.model_dump())
            db.add(new_type)
            await db.commit()
            await db.refresh(new_type)
            return new_type
    
        except IntegrityError as e:
            await db.rollback()
            error = e.orig
            if error:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Erro: {getattr(error,"detail",str(error))}")
        

    @staticmethod
    async def update(db:AsyncSession, id:int, type_management: ManagementTypeUpdate):
        query = select(ManagementType).where(ManagementType.id == id)
        res = await db.execute(query)
        db_type = res.scalars().first()

        if db_type is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Tipo de manejamento não encontrado")
        
        update_type = type_management.model_dump(exclude_unset=True)
        
        #Se eu mudar o manejo para como não frequente, eu coloco os dias de intervalo como Nulos
        if update_type.get('is_recurrent') is False:
            update_type['days_interval'] = None

        for key, value in update_type.items():
            setattr(db_type,key,value)

        await db.commit()
        await db.refresh(db_type)

        return db_type
    
    @staticmethod
    async def delete(db: AsyncSession, id:int):
        query = select(ManagementType).where(ManagementType.id == id)
        res = await db.execute(query)
        bd_type = res.scalars().first()
 
        if bd_type == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tipo de manejo não encontrado")
        
        await db.delete(bd_type)
        await db.commit()

        return HTTPException(status_code=status.HTTP_204_NO_CONTENT,detail="Tipo de manejo excluído")

        
        