from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy.orm import relationship
from core.database import Base

class ManagementType(Base):

    __tablename__= 'management_type'

    id  = Column(Integer,primary_key=True,autoincrement=True)
    type_name =  Column(String(100), nullable=False)
    is_recurrent = Column(Boolean, nullable=False)
    description = Column(String(150),nullable=False) 
    days_interval = Column(Integer,nullable=True)
    events = relationship("ManagementEvent", back_populates="type")