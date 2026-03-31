import { useEffect, useState } from 'react'
import { BeatLoader, ClipLoader } from 'react-spinners'
import './App.css'

function App() {
  const [city,setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [time,setTime] = useState(new Date())

  const handleSearch = async() => {
    setError('')
    setWeather(null)
    setLoading(true)
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_WEATHER_KEY}&units=metric&lang=ru`)
    const data = await res.json()
    if(data.cod !== 200) {
      setError('Город не найден')
      setLoading(false)
      return data
    }
    setWeather(data)
    setLoading(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  },[])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_KEY}&units=metric&lang=ru`)
          .then(res => res.json())
          .then(data => setWeather(data))
      },
      (error) => {
        console.log('геолакация отклонена')
      }
    )
  }, [])
  return (
    
    <div className='bg-[#160524] h-screen pt-10 pb-10 font-poppins'>
      <div className='text-white max-w-[1200px] mx-auto flex flex-col sm:flex-row gap-3 mb-10'>
        <div>
          <h1 className='text-xl sm:text-3xl font-semibold'>🌤 Weather App</h1>
          <p className='text-lg text-white/70'>Введи город чтобы узнать погоду</p>
        </div>
        <div className='flex gap-3 text-sm sm:text-xl font-semibold'>
          <p>{time.toLocaleDateString('ru-RU')}</p>
          <p>{time.toLocaleTimeString('ru-RU')}</p>
        </div>
      </div>
    <div className='mx-auto w-full sm:max-w-[500px] text-center text-white animated-bg rounded-xl p-5 sm:p-10'>
      <div className='flex justify-center '>
        <input type="text" onChange={e => setCity(e.target.value)} value={city} placeholder='Пиши город' onKeyDown={e => e.key === "Enter" && handleSearch()} className='bg-white/10 text-white py-3 px-5 rounded-full outline-none flex-1'/>
        <button onClick={() => handleSearch()} className='py-3 px-6 bg-[#042667] rounded-2xl hover:bg-[#002E78] hover:scale-105 transition-all duration-300 '>{loading ? <BeatLoader  size= {10} color='white'/> : "Search" }
        </button>
      </div>
      
      
      {error && <p className='text-red-500'>{error}</p>}
      {weather && (
        
        <div className='flex flex-col items-center gap-2 mt-5'>
          <p className='text-2xl font-bold'>{weather.name}</p>
          <p className='text-4xl sm:text-6xl font-bold'>{weather.main.temp}°C</p>
          <p className='text-lg capitalize text-white/70'>{weather.weather[0].description}</p>
          <p className='text-sm text-white/60'>Влажность: {weather.main.humidity}%</p>
          <p className='text-sm text-white/60'>Ветер: {weather.wind.speed} м/с</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} className='w-40 h-40 mx-auto'/>
        </div>
      )}
    </div>
    </div>
  )
}

export default App
