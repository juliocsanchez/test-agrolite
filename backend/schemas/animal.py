from pydantic import BaseModel
from typing import Optional

class AnimalCreate(BaseModel):

    code : str
    species : str

class AnimalUpdate(BaseModel):
    
    code : Optional[str] 
    species : Optional[str] 

class AnimalResponse(AnimalCreate):
    id : int
    class Config:
        from_atributtes = True