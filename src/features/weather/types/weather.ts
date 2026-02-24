export const WEATHER_FORECAST_DAYS = 7

export const DEFAULT_WEATHER_LOCATION_KEY = 'chiba'

export type WeatherLocationKey = 'chiba' | 'tokyo'

export type WeatherLocationOption = {
  key: WeatherLocationKey
  label: string
}

export type LaundryLevel = 'gold' | 'normal' | 'white'

export type LaundryJudgement = {
  level: LaundryLevel
  // 注意が必要な場合のみ指定（例：「風に注意」「雨に注意」）
  caution?: string
}

export type WeatherForecastDay = {
  date: string
  dateLabel: string
  humidity: number
  isToday: boolean
  laundry: LaundryJudgement
  maxTemperature: number
  minTemperature: number
  precipitationProbability: number
  weatherCode: number
  weatherEmoji: string
  weatherLabel: string
  windSpeed: number
}

export type OpenMeteoDailyResponse = {
  time: string[]
  precipitation_probability_max: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  weather_code: number[]
  wind_speed_10m_max: number[]
  relative_humidity_2m_mean: number[]
}

export type OpenMeteoForecastResponse = {
  daily: OpenMeteoDailyResponse
}