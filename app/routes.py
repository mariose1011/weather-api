from fastapi import APIRouter, HTTPException, Depends, Request
from services import get_weather_vc
from schemas import WeatherParams
from slowapi import Limiter

router = APIRouter()

limiter = Limiter(key_func=lambda: "dummy")  

@router.get("/weather/vc/{location}")
@limiter.limit("10/minute" ) # máximo 10 solicitudes por minuto
def weather_vc(request: Request, location: str, params: WeatherParams = Depends()):
    # Desempaqueta los parámetros para pasarlos a la función del servicio
    data = get_weather_vc(location, params.start, params.end, params.units)
    if "error" in data:
        raise HTTPException(status_code=503, detail=data["error"])
    
    return data
