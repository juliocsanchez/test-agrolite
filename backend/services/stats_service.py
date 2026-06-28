from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select,func
from models.management_event import ManagementEvent
from models.management_type import ManagementType
from models.animal import Animal
from sqlalchemy.orm import joinedload
from schemas.management_event import ManagementStatsByType, ManagementStatsResponse

class StatsService:
    @staticmethod 

    async def getStats(db:AsyncSession) -> ManagementStatsResponse:

        today = date.today()

        query_animal = await db.execute((select(func.count()).select_from(Animal)))
        total_animals = query_animal.scalar_one()

        managements_by_type_query = await db.execute(
            select(ManagementType.type_name ,func.count(ManagementEvent.id).label("count"))
            .join(ManagementEvent, ManagementType.id == ManagementEvent.type_id)
            .group_by(ManagementType.type_name)
            .order_by(func.count(ManagementEvent.id).desc())
            )
        
        managements_by_type = [
            ManagementStatsByType(type_name=row[0], count=row[1])
            for row in managements_by_type_query.all()
        ]

        managements_events_query = await db.execute(
            select(ManagementEvent)
            .options(joinedload(ManagementEvent.type))
        )

        management_events = managements_events_query.scalars().all()

        latest_per_type: dict[tuple[int, int], ManagementEvent] = {}
        for event in management_events:
                key = (event.animal_id, event.type_id) 
                if key not in latest_per_type or event.management_date > latest_per_type[key].management_date:
                    latest_per_type[key] = event
        

        pending_animals: set[int] = set()
        all_animals: set[int] = set()
        for (animal_id, _), event in latest_per_type.items():
            all_animals.add(animal_id)
            interval = event.type.days_interval
            if interval is not None:
                timeframe = event.management_date + timedelta(days=interval)
                if timeframe < today:
                    pending_animals.add(animal_id)

        animals_ok = all_animals - pending_animals
        up_to_date = len(animals_ok)
        percent = round(up_to_date / total_animals * 100, 1) if total_animals > 0 else 0.0

        return ManagementStatsResponse(
            total_animals=total_animals,
            animals_up_to_date=up_to_date,
            percent_up_to_date=percent,
            by_type=managements_by_type,
    )

