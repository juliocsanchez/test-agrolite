from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends
from schemas.management_event import ManagementStatsResponse
from core.database.connect import get_bd
from services.stats_service import StatsService


stats_router = APIRouter()

@stats_router.get("/",summary="Retorna dados do rebanho e tipo de manejo",response_model=ManagementStatsResponse)
async def get_stats(db:AsyncSession = Depends(get_bd)):
    return await StatsService.getStats(db)