from pydantic import BaseModel
from typing import Optional

class AnimalCreate(BaseModel):

    code : str
    species : str

class AnimalUpdate(BaseModel):
    
    code : Optional[str] = None
    species : Optional[str] = None

class AnimalResponse(AnimalCreate):
    id : int
    class Config:
        from_atributtes = True