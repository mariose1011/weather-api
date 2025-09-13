import React, { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const WeatherIcon = ({ weather }) => {
  const getIcon = (weatherText) => {
    if (weatherText.toLowerCase().includes('sol') || weatherText.toLowerCase().includes('despej')) {
      return '☀️'
    } else if (weatherText.toLowerCase().includes('nubl') || weatherText.toLowerCase().includes('cloud')) {
      return '☁️'
    } else if (weatherText.toLowerCase().includes('lluvia') || weatherText.toLowerCase().includes('rain')) {
      return '🌧️'
    } else if (weatherText.toLowerCase().includes('nieve') || weatherText.toLowerCase().includes('snow')) {
      return '❄️'
    } else if (weatherText.toLowerCase().includes('tormenta') || weatherText.toLowerCase().includes('storm')) {
      return '⛈️'
    }
    return '🌤️'
  }
  
  return <span className="text-3xl">{getIcon(weather)}</span>
}

function App() {
  const [city, setCity] = useState("Madrid")
  const [date, setDate] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  //Calcular la fecha máxima (hoy + 15 dias)
  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + 15)
  const formatDate = (d) => d.toISOString().split('T')[0]

  const getWeather = async () => {
    try {
      let url = `/api/weather/${city}`
      if (date) url += `?start=${date}`
      
      const response = await fetch(url,{
        headers: {
          'Accept': 'application/json'
        }
      })

      if(!response.ok) throw new Error("Error en la API");
      
      const data = await response.json()
      setWeather(data)
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather()
    }
  }
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full blur-md animate-ping"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/20">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🌤️</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-blue-700">
  Weather App
</h1>
        <p className="text-gray-600 mt-2">Consulta el pronóstico del tiempo</p>
      </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
               Fecha (opcional)
            </label>
            <input
              type="date"
              value={date}
              min={formatDate(today)}
              max={formatDate(maxDate)}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>

          <button
            onClick={getWeather}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Cargando...
              </div>
            ) : (
              'Obtener Pronóstico'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Weather Results */}
        {weather && !loading && (
          <div className="mt-8 space-y-4 animate-fadeIn">
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                📍 {weather.city}
              </h2>
              <p className="text-gray-600">Pronóstico para los próximos días</p>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {weather.days.map((day, index) => (
                <div
                  key={day.date}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40 hover:bg-white/80 transition-all duration-200 transform hover:scale-102"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'slideInUp 0.5s ease-out forwards'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <WeatherIcon weather={day.weather} />
                      <div>
                        <div className="font-semibold text-gray-800">
                          {formatDateForDisplay(day.date)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {day.weather}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        <span className="text-red-500">{day.max_temp}°</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-blue-500">{day.min_temp}°</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {weather.days.length > 3 && (
              <div className="text-center text-sm text-gray-500">
                Mostrando {weather.days.length} días de pronóstico
              </div>
            )}
          </div>
        )}
      </div>
      </div>
  )
}

export default App;
