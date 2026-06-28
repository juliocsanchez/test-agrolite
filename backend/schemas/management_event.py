from pydantic import BaseModel
from typing import List, Optional
import datetime

class ManagementEventBase(BaseModel):

    type_id : int
    animal_id : int 
    management_date : datetime.date
    photo_url : Optional[str] = None


class ManagementEventHistory(BaseModel):

    id: int
    type_name: str
    animal_code : str
    management_date: datetime.date
    description: Optional[str] = None
    days_interval: Optional[int] = None
    photo_url: Optional[str] = None

    class Config:
        from_attributes = True

class ManagementEventAnimalHistory(BaseModel):
    
    id: int
    type_name: str
    management_date: datetime.date
    description: Optional[str] = None
    days_interval: Optional[int] = None
    photo_url: Optional[str] = None

    class Config:
        from_attributes = True

class ManagementStatsByType(BaseModel):
    type_name : str
    count: int


class ManagementStatsResponse(BaseModel):
    total_animals: int
    animals_up_to_date:int
    percent_up_to_date:float
    by_type : List[ManagementStatsByType]


class ManagementEventResponse(ManagementEventBase):
    id: int
    class Config:
        from_attributes = True
  
