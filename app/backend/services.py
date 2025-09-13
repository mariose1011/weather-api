import os
import requests
import redis
import json
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("VC_API_KEY")
BASE_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
cache = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def get_weather_vc(location: str, start_date: str = None, end_date: str = None, units: str = "metric"):
    if not API_KEY:
        return {"error": "API key no configurada. Revisar .env"}
    
    # Generar clave de cache
    cache_key = f"{location}:{start_date}:{end_date}:{units}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    
    #Construir la URL
    url = f"{BASE_URL}/{location}"
    if start_date and end_date:
        url += f"/{start_date}/{end_date}"
    elif start_date:
        url += f"/{start_date}"

    params = {
        "key": API_KEY,
        "unitGroup": units,
        "contentType": "json"
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status() #Lanza excepción si no es 200
        
        data = response.json()
        days = data.get('days', [])
        
        if not days:
            return {"error": "No hay datos para este rango"}
        
        processed_days = []
        for day in days:
            temp_symbol = "ºC" if units == "metric" else "ºF"
            wind_unit = "km/h" if units == "metric" else "mph"
            processed_days.append({
                "date": day.get('datetime','N/A'),
                'weather': day.get('conditions','Desconocido'),
                'max_temp': f"{day.get('tempmax',day.get('temp','')):.1f}{temp_symbol}",
                'min_temp': f"{day.get('tempmin',day.get('temp','')):.1f}{temp_symbol}",
                "humidity": f"{day.get('humidity', 0):.1f}%",
                "wind_speed": f"{day.get('windspeed',0):.1f} {wind_unit}",
                "description": day.get('description', 'No disponible')

            })

        result = {
            "success":True,
            "city": location,
            "range": f"{start_date} to {end_date}" if start_date and end_date else "Default (next 15 days)",
            "days": processed_days            
        }

        #Guardar cache por una hora
        cache.setex(cache_key, 3600, json.dumps(result))
        return result
    
    except requests.exceptions.HTTPError as e:
        return {"error": f"Error en la API: {str(e)} (código {response.status_code})"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Fallo de conexión: {str(e)}"}
    except (KeyError, IndexError):
        return {"error":"Datos no disponibles para esta ubicación o fechas"}