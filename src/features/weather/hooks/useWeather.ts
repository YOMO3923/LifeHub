import { useCallback, useEffect, useState } from 'react'
import { fetchWeeklyWeather } from '@/features/weather/api/weatherApi'
import type { WeatherForecastDay, WeatherLocationKey } from '@/features/weather/types/weather'
import { DEFAULT_WEATHER_LOCATION_KEY } from '@/features/weather/types/weather'

const WEATHER_CACHE_TTL_MS = 60 * 60 * 1000
const WEATHER_CACHE_KEY_PREFIX = 'lifehub:weather-cache'

type WeatherCachePayload = {
  fetchedAt: number
  weatherDays: WeatherForecastDay[]
}

const getWeatherCacheKey = (locationKey: WeatherLocationKey) => {
  return `${WEATHER_CACHE_KEY_PREFIX}:${locationKey}`
}

const readWeatherCache = (locationKey: WeatherLocationKey): WeatherForecastDay[] | null => {
  const rawCache = localStorage.getItem(getWeatherCacheKey(locationKey))

  if (!rawCache) {
    return null
  }

  try {
    const parsedCache = JSON.parse(rawCache) as WeatherCachePayload

    if (!parsedCache.fetchedAt || !Array.isArray(parsedCache.weatherDays)) {
      localStorage.removeItem(getWeatherCacheKey(locationKey))
      return null
    }

    const cacheAge = Date.now() - parsedCache.fetchedAt
    const isCacheExpired = cacheAge >= WEATHER_CACHE_TTL_MS

    if (isCacheExpired) {
      localStorage.removeItem(getWeatherCacheKey(locationKey))
      return null
    }

    return parsedCache.weatherDays
  } catch {
    localStorage.removeItem(getWeatherCacheKey(locationKey))
    return null
  }
}

const writeWeatherCache = (locationKey: WeatherLocationKey, weatherDays: WeatherForecastDay[]) => {
  const cachePayload: WeatherCachePayload = {
    fetchedAt: Date.now(),
    weatherDays,
  }

  localStorage.setItem(getWeatherCacheKey(locationKey), JSON.stringify(cachePayload))
}

// 指定した地点のキャッシュを削除します。
// ユーザーが明示的に更新ボタンを押したときに、強制的に新しいデータを取得するために使用します。
const clearWeatherCache = (locationKey: WeatherLocationKey) => {
  localStorage.removeItem(getWeatherCacheKey(locationKey))
}

export const useWeather = () => {
  const [weatherDays, setWeatherDays] = useState<WeatherForecastDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocationKey>(DEFAULT_WEATHER_LOCATION_KEY)

  const loadWeather = useCallback(async (locationKey: WeatherLocationKey) => {
    setErrorMessage(null)

    // まず1時間キャッシュを確認し、有効ならAPIを呼ばずに即時表示します。
    const cachedWeatherDays = readWeatherCache(locationKey)

    if (cachedWeatherDays) {
      setWeatherDays(cachedWeatherDays)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const fetchedWeatherDays = await fetchWeeklyWeather(locationKey)
      setWeatherDays(fetchedWeatherDays)
      writeWeatherCache(locationKey, fetchedWeatherDays)
    } catch {
      setErrorMessage('天気データの取得に失敗しました。時間をおいて再試行してください。')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadWeather(selectedLocation)
  }, [loadWeather, selectedLocation])

  const handleChangeLocation = useCallback((locationKey: WeatherLocationKey) => {
    setSelectedLocation(locationKey)
  }, [])

  // ユーザーが更新ボタンをクリックした時に使用します。
  // キャッシュをクリアして、強制的に新しいAPIデータを取得します。
  const retryLoadWeather = useCallback(() => {
    clearWeatherCache(selectedLocation)
    void loadWeather(selectedLocation)
  }, [loadWeather, selectedLocation])

  return {
    weatherDays,
    isLoading,
    errorMessage,
    selectedLocation,
    handleChangeLocation,
    retryLoadWeather,
  }
}