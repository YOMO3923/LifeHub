import type {
  LaundryJudgement,
  OpenMeteoForecastResponse,
  WeatherForecastDay,
  WeatherLocationOption,
  WeatherLocationKey,
} from '@/features/weather/types/weather'
import { DEFAULT_WEATHER_LOCATION_KEY, WEATHER_FORECAST_DAYS } from '@/features/weather/types/weather'

const OPEN_METEO_FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'
const TOKYO_TIMEZONE = 'Asia/Tokyo'
const DAYTIME_END_HOUR = 18
const DAYTIME_START_HOUR = 6
const GOLD_HUMIDITY_THRESHOLD = 65
const GOLD_PRECIPITATION_PROBABILITY_THRESHOLD = 20
const NORMAL_CAUTION_PRECIPITATION_PROBABILITY_THRESHOLD = 30
const WHITE_PRECIPITATION_PROBABILITY_THRESHOLD = 60
const HIGH_HUMIDITY_THRESHOLD = 80
const STRONG_WIND_THRESHOLD = 8
const VERY_STRONG_WIND_THRESHOLD = 11

const SEVERE_WET_CATEGORIES = new Set<WeatherCategory>([
  'thunderstorm',
  'snow',
  'snowShower',
  'freezingRain',
  'freezingDrizzle',
])
const WET_CATEGORIES = new Set<WeatherCategory>(['drizzle', 'rain', 'rainShower'])
const RAINY_CATEGORIES = new Set<WeatherCategory>([
  'drizzle',
  'freezingDrizzle',
  'rain',
  'freezingRain',
  'rainShower',
  'snow',
  'snowShower',
  'thunderstorm',
])

type WeatherCategory =
  | 'clear'
  | 'partlyCloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'freezingDrizzle'
  | 'rain'
  | 'freezingRain'
  | 'snow'
  | 'rainShower'
  | 'snowShower'
  | 'thunderstorm'
  | 'unknown'

type WeatherCodeDetail = {
  category: WeatherCategory
  emoji: string
  label: string
}

const WEATHER_LOCATION_MAP: Record<WeatherLocationKey, { label: string; latitude: number; longitude: number }> = {
  // 千葉をデフォルト地点にします。
  chiba: {
    label: '千葉',
    latitude: 35.6074,
    longitude: 140.1065,
  },
  tokyo: {
    label: '東京',
    latitude: 35.6762,
    longitude: 139.6503,
  },
}

export const WEATHER_LOCATION_OPTIONS: WeatherLocationOption[] = [
  { key: 'chiba', label: WEATHER_LOCATION_MAP.chiba.label },
  { key: 'tokyo', label: WEATHER_LOCATION_MAP.tokyo.label },
]

const WEATHER_CODE_DETAIL_MAP: Record<number, WeatherCodeDetail> = {
  0: { category: 'clear', label: '快晴', emoji: '☀️' },
  1: { category: 'clear', label: '晴れ', emoji: '☀️' },
  2: { category: 'partlyCloudy', label: '薄曇り', emoji: '🌤️' },
  3: { category: 'cloudy', label: '曇り', emoji: '☁️' },
  45: { category: 'fog', label: '霧', emoji: '🌫️' },
  48: { category: 'fog', label: '着氷性の霧', emoji: '🌫️' },
  51: { category: 'drizzle', label: '弱い霧雨', emoji: '🌦️' },
  53: { category: 'drizzle', label: '霧雨', emoji: '🌦️' },
  55: { category: 'drizzle', label: '強い霧雨', emoji: '🌧️' },
  56: { category: 'freezingDrizzle', label: '弱い着氷性の霧雨', emoji: '🌧️' },
  57: { category: 'freezingDrizzle', label: '強い着氷性の霧雨', emoji: '🌧️' },
  61: { category: 'rain', label: '弱い雨', emoji: '🌧️' },
  63: { category: 'rain', label: '雨', emoji: '🌧️' },
  65: { category: 'rain', label: '強い雨', emoji: '🌧️' },
  66: { category: 'freezingRain', label: '弱い着氷性の雨', emoji: '🌧️' },
  67: { category: 'freezingRain', label: '強い着氷性の雨', emoji: '🌧️' },
  71: { category: 'snow', label: '弱い雪', emoji: '❄️' },
  73: { category: 'snow', label: '雪', emoji: '❄️' },
  75: { category: 'snow', label: '強い雪', emoji: '❄️' },
  77: { category: 'snow', label: '雪粒', emoji: '❄️' },
  80: { category: 'rainShower', label: '弱いにわか雨', emoji: '🌦️' },
  81: { category: 'rainShower', label: 'にわか雨', emoji: '🌧️' },
  82: { category: 'rainShower', label: '強いにわか雨', emoji: '🌧️' },
  85: { category: 'snowShower', label: '弱いにわか雪', emoji: '🌨️' },
  86: { category: 'snowShower', label: '強いにわか雪', emoji: '🌨️' },
  95: { category: 'thunderstorm', label: '雷雨', emoji: '⛈️' },
  96: { category: 'thunderstorm', label: '弱いひょうを伴う雷雨', emoji: '⛈️' },
  99: { category: 'thunderstorm', label: '強いひょうを伴う雷雨', emoji: '⛈️' },
}

const getWeatherCodeDetail = (weatherCode: number): WeatherCodeDetail => {
  return WEATHER_CODE_DETAIL_MAP[weatherCode] ?? {
    category: 'unknown',
    label: '天気情報',
    emoji: '🌈',
  }
}

type PeriodWeatherMetrics = {
  hasRain: boolean
  maxPrecipitationProbability: number
}

type DailyPeriodWeatherMetrics = {
  daytime: PeriodWeatherMetrics
  night: PeriodWeatherMetrics
}

const createDefaultPeriodWeatherMetrics = (): PeriodWeatherMetrics => {
  return {
    hasRain: false,
    maxPrecipitationProbability: 0,
  }
}

const createDefaultDailyPeriodWeatherMetrics = (): DailyPeriodWeatherMetrics => {
  return {
    daytime: createDefaultPeriodWeatherMetrics(),
    night: createDefaultPeriodWeatherMetrics(),
  }
}

const getDateFromHourlyTime = (hourlyTime: string) => {
  return hourlyTime.split('T')[0]
}

const getHourFromHourlyTime = (hourlyTime: string) => {
  const hourText = hourlyTime.split('T')[1]?.slice(0, 2)
  const parsedHour = Number(hourText)

  if (Number.isNaN(parsedHour)) {
    return 0
  }

  return parsedHour
}

const isDaytimeHour = (hour: number) => {
  return hour >= DAYTIME_START_HOUR && hour < DAYTIME_END_HOUR
}

const buildDailyPeriodMetricsMap = (hourly: OpenMeteoForecastResponse['hourly']) => {
  const metricsByDate: Record<string, DailyPeriodWeatherMetrics> = {}

  const hourlyLength = Math.min(
    hourly.time.length,
    hourly.weather_code.length,
    hourly.precipitation_probability.length,
    hourly.precipitation.length
  )

  for (let index = 0; index < hourlyLength; index += 1) {
    const date = getDateFromHourlyTime(hourly.time[index])
    const hour = getHourFromHourlyTime(hourly.time[index])
    const weatherCode = hourly.weather_code[index]
    const precipitationProbability = hourly.precipitation_probability[index]
    const precipitation = hourly.precipitation[index]

    if (!metricsByDate[date]) {
      metricsByDate[date] = createDefaultDailyPeriodWeatherMetrics()
    }

    const targetPeriod = isDaytimeHour(hour) ? metricsByDate[date].daytime : metricsByDate[date].night
    const weatherCategory = getWeatherCodeDetail(weatherCode).category
    const hasRain = RAINY_CATEGORIES.has(weatherCategory) || precipitation > 0

    targetPeriod.hasRain = targetPeriod.hasRain || hasRain
    targetPeriod.maxPrecipitationProbability = Math.max(targetPeriod.maxPrecipitationProbability, precipitationProbability)
  }

  return metricsByDate
}

const buildLaundryJudgement = ({
  daytimeHasRain,
  daytimeMaxPrecipitationProbability,
  humidity,
  nightHasRain,
  weatherCategory,
  windSpeed,
}: {
  daytimeHasRain: boolean
  daytimeMaxPrecipitationProbability: number
  humidity: number
  nightHasRain: boolean
  weatherCategory: WeatherCategory
  windSpeed: number
}): LaundryJudgement => {
  const cautionReasons: string[] = []

  const isStrongWind = windSpeed >= STRONG_WIND_THRESHOLD
  const isVeryStrongWind = windSpeed >= VERY_STRONG_WIND_THRESHOLD
  const isHighHumidity = humidity >= HIGH_HUMIDITY_THRESHOLD
  const hasHighPrecipitationRisk = daytimeMaxPrecipitationProbability >= WHITE_PRECIPITATION_PROBABILITY_THRESHOLD
  const hasModeratePrecipitationRisk =
    daytimeMaxPrecipitationProbability >= NORMAL_CAUTION_PRECIPITATION_PROBABILITY_THRESHOLD
  const isClearLike = weatherCategory === 'clear' || weatherCategory === 'partlyCloudy'

  // 日中に雨が降る可能性が高い日は、外干しで再度濡れる可能性が高いため非推奨にします。
  if (daytimeHasRain || hasHighPrecipitationRisk) {
    if (SEVERE_WET_CATEGORIES.has(weatherCategory)) {
      if (weatherCategory === 'thunderstorm') {
        cautionReasons.push('雷雨に注意')
      } else if (weatherCategory === 'snow' || weatherCategory === 'snowShower') {
        cautionReasons.push('雪に注意')
      } else {
        cautionReasons.push('雨に注意')
      }
    } else {
      cautionReasons.push('雨に注意')
    }

    if (isStrongWind) {
      cautionReasons.push('風に注意')
    }

    return {
      level: 'white',
      caution: cautionReasons.join('・'),
    }
  }

  // 乾きやすさと雨リスクの両方を満たし、夜間の雨もない場合のみ Gold にします。
  if (
    isClearLike &&
    humidity < GOLD_HUMIDITY_THRESHOLD &&
    daytimeMaxPrecipitationProbability < GOLD_PRECIPITATION_PROBABILITY_THRESHOLD &&
    !nightHasRain &&
    !isVeryStrongWind
  ) {
    if (isStrongWind) {
      cautionReasons.push('風に注意')
    }

    return {
      level: 'gold',
      caution: cautionReasons.length > 0 ? cautionReasons.join('・') : undefined,
    }
  }

  // 夜間のみ雨のケースは、日中は干せるためOKにしつつ注意を残します。
  if (nightHasRain) {
    cautionReasons.push('早朝/夜の雨に注意')
  }

  if (isStrongWind) {
    cautionReasons.push('風に注意')
  }

  if (hasModeratePrecipitationRisk && !daytimeHasRain) {
    cautionReasons.push('雨に注意')
  }

  if (isHighHumidity) {
    cautionReasons.push('湿気に注意')
  }

  if (WET_CATEGORIES.has(weatherCategory) && !daytimeHasRain) {
    cautionReasons.push('にわか雨に注意')
  }

  return {
    level: 'normal',
    caution: cautionReasons.length > 0 ? cautionReasons.join('・') : undefined,
  }
}

const toDateLabel = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00+09:00`)
  return new Intl.DateTimeFormat('ja-JP', {
    day: 'numeric',
    month: 'numeric',
    weekday: 'short',
  }).format(parsedDate)
}

const toWeatherForecastDays = (forecastResponse: OpenMeteoForecastResponse): WeatherForecastDay[] => {
  const { daily, hourly } = forecastResponse
  const periodMetricsByDate = buildDailyPeriodMetricsMap(hourly)

  const dailyLength = Math.min(
    daily.time.length,
    daily.precipitation_probability_max.length,
    daily.temperature_2m_max.length,
    daily.temperature_2m_min.length,
    daily.weather_code.length,
    daily.wind_speed_10m_max.length,
    daily.relative_humidity_2m_mean.length,
    WEATHER_FORECAST_DAYS
  )

  return Array.from({ length: dailyLength }, (_, index) => {
    const date = daily.time[index]
    const weatherCode = daily.weather_code[index]
    const weatherDetail = getWeatherCodeDetail(weatherCode)
    const humidity = daily.relative_humidity_2m_mean[index]
    const dailyMaxPrecipitationProbability = daily.precipitation_probability_max[index]
    const periodMetrics = periodMetricsByDate[date] ?? createDefaultDailyPeriodWeatherMetrics()
    // APIから取得した風速はkm/h単位で返されます。
    // UI表示と洗濯判定はm/sで扱うため、ここでm/sに変換します。
    // 計算: km/h ÷ 3.6 = m/s
    const windSpeedKmh = daily.wind_speed_10m_max[index]
    const windSpeedMs = windSpeedKmh / 3.6
    const roundedWindSpeedMs = Math.round(windSpeedMs)

    return {
      date,
      dateLabel: toDateLabel(date),
      isToday: index === 0,
      weatherCode,
      weatherEmoji: weatherDetail.emoji,
      weatherLabel: weatherDetail.label,
      maxTemperature: Math.round(daily.temperature_2m_max[index]),
      minTemperature: Math.round(daily.temperature_2m_min[index]),
      precipitationProbability: Math.round(dailyMaxPrecipitationProbability),
      windSpeed: roundedWindSpeedMs,
      humidity: Math.round(humidity),
      // UI表示値と判定値のズレを防ぐため、風速は丸め後のm/sで判定します。
      // 例: 表示が 8m/s なら、必ず「8m/s相当」の判定になります。
      laundry: buildLaundryJudgement({
        daytimeHasRain: periodMetrics.daytime.hasRain,
        daytimeMaxPrecipitationProbability: periodMetrics.daytime.maxPrecipitationProbability,
        humidity,
        nightHasRain: periodMetrics.night.hasRain,
        weatherCategory: weatherDetail.category,
        windSpeed: roundedWindSpeedMs,
      }),
    }
  })
}

export const fetchWeeklyWeather = async (
  locationKey: WeatherLocationKey = DEFAULT_WEATHER_LOCATION_KEY
): Promise<WeatherForecastDay[]> => {
  const selectedLocation = WEATHER_LOCATION_MAP[locationKey]

  if (!selectedLocation) {
    throw new Error('対象の地点が見つかりません。')
  }

  const searchParams = new URLSearchParams({
    latitude: String(selectedLocation.latitude),
    longitude: String(selectedLocation.longitude),
    timezone: TOKYO_TIMEZONE,
    forecast_days: String(WEATHER_FORECAST_DAYS),
    daily:
      'temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,relative_humidity_2m_mean,precipitation_probability_max',
    hourly: 'weather_code,precipitation_probability,precipitation',
  })

  const response = await fetch(`${OPEN_METEO_FORECAST_ENDPOINT}?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error('天気データの取得に失敗しました。')
  }

  const data = (await response.json()) as OpenMeteoForecastResponse

  if (!data.daily || !data.hourly) {
    throw new Error('天気データの形式が不正です。')
  }

  return toWeatherForecastDays(data)
}