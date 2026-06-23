from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from core.database.connect import Base

class Animal(Base):

    __tablename__= 'animal'

    id = Column(Integer,autoincrement=True,unique=True,primary_key=True,nullable=False)
    code = Column(String, unique=True,nullable=True)
    species = Column(String(100),nullable=False)
    events = relationship("ManagementEvent",back_populates="animal")