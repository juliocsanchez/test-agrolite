from fastapi import APIRouter
from schemas.animal import AnimalResponse

animal_router = APIRouter()

@animal_router.get("/",summary="Lista animais cadastrados",response_model=list[AnimalResponse])
async def list_animals():
    return 