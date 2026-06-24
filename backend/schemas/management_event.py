from pydantic import BaseModel
from typing import Optional
import datetime

class ManagementEventCreate(BaseModel):

    type_id : int
    animal_id : int 
    management_date : datetime.date
    description : Optional[str] = None
    photo_url : Optional[str] = None

class ManagementEventResponse(ManagementEventCreate):
    id: int
    class Config:
        from_attributes = True
  
