from pydantic import BaseModel

class AnimalCreate(BaseModel):

    id : int    
    species : str


