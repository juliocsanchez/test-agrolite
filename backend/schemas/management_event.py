from pydantic import BaseModel
from typing import Optional
import datetime

class ManagementEventCreate(BaseModel):

    id  : int
    type_id : int
    animal_id : int 
    management_date : datetime.date
    description : str 
    photo_url : Optional[str] = None
  
