from sqlalchemy import Column, String, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from core.database.connect import Base

class ManagementEvent(Base):

    __tablename__= 'management_event'

    id  = Column(Integer,primary_key=True,autoincrement=True)
    type_id =  Column(Integer,ForeignKey("management_type.id"),nullable=False,index=True)
    animal_id = Column(Integer, ForeignKey("animal.id"),nullable=False,index=True)
    management_date = Column(Date, nullable=False)
    description = Column(String(150),nullable=True) 
    photo_url = Column(String(255),nullable=True)
    type = relationship("ManagementType",back_populates="events")
    animal = relationship("Animal",back_populates="events")

