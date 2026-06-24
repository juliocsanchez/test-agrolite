from fastapi import APIRouter
from api.handlers.animal_router import animal_router
from api.handlers.type_router import types_router
from api.handlers.management_router import event_router

router = APIRouter()
router.include_router(animal_router,prefix='/animal',tags=['animal'])
router.include_router(types_router,prefix ='/type',tags=['types'])
router.include_router(event_router,prefix ='/management',tags=['managements'])


