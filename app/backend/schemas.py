from pydantic import BaseModel, Field
from typing import Optional

class WeatherParams(BaseModel):
    start: Optional[str] = Field(None, pattern=r'^\d{4}-\d{2}-\d{2}$', description="Fecha de inicio en formato YYYY-MM-DD")
    end: Optional[str] = Field(None, pattern=r'^\d{4}-\d{2}-\d{2}$', description="Fecha de fin en formato YYYY-MM-DD")
    units: str = Field("metric", pattern=r'^(metric|imperial)$', description="Unidades de medida: 'metric' o 'imperial'")
