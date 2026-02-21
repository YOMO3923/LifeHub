export const WEATHER_FORECAST_DAYS = 7

export const DEFAULT_WEATHER_LOCATION_KEY = 'chiba'

export type WeatherLocationKey = 'chiba' | 'tokyo'

export type WeatherLocationOption = {
  key: WeatherLocationKey
  label: string
}

export type LaundryLevel = 'gold' | 'normal' | 'white'

export type LaundryJudgement = {
  description: string
  level: LaundryLevel
}

export type WeatherForecastDay = {
  date: string
  dateLabel: string
  humidity: number
  isToday: boolean
  laundry: LaundryJudgement
  maxTemperature: number
  minTemperature: number
  weatherCode: number
  weatherEmoji: string
  weatherLabel: string
  windSpeed: number
}

export type OpenMeteoDailyResponse = {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  weather_code: number[]
  wind_speed_10m_max: number[]
  relative_humidity_2m_mean: number[]
}

export type OpenMeteoForecastResponse = {
  daily: OpenMeteoDailyResponse
}