from pydantic import BaseModel, model_validator
from typing import Optional

class ManagementTypeCreate(BaseModel):

    type_name : str
    is_recurrent : bool
    description : Optional[str] = None
    days_interval : Optional[int] = None

    @model_validator(mode="after")
    def validate_interval(self):

        if self.is_recurrent and self.days_interval == None:
            raise ValueError("days_interval não pode estar vazio, o manejo é recorrente")
        
        if not self.is_recurrent and self.days_interval is not None:
            raise ValueError("O manejo não é recorrente, days_interval deve ser None")
        
        if self.is_recurrent and self.days_interval <= 0:
            raise ValueError("days_interval não pode ser 0 ou um valor negativo")
        
        return self

class ManagementTypeUpdate(BaseModel):

    type_name : Optional[str] = None
    is_recurrent : bool
    description : Optional[str] = None
    days_interval : Optional[int] = None

    @model_validator(mode="after")
    def validate_interval(self):

        if self.is_recurrent and self.days_interval == None:
            raise ValueError("days_interval não pode estar vazio, o manejo é recorrente")
        
        if not self.is_recurrent and self.days_interval is not None:
            raise ValueError("O manejo não é recorrente, days_interval deve ser None")
        
        if self.is_recurrent and self.days_interval <= 0:
            raise ValueError("days_interval não pode ser 0 ou um valor negativo")
        
        return self

class ManagementTypeResponse(ManagementTypeCreate):
    id : int
    class Config:
        from_atributtes = True



