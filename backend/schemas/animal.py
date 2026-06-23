from pydantic import BaseModel

class AnimalCreate(BaseModel):

    code : str
    species : str

class AnimalResponse(AnimalCreate):
    id : int
    class Config:
        from_atributtes = True