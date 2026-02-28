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
const GOLD_HUMIDITY_THRESHOLD = 65
const GOLD_PRECIPITATION_PROBABILITY_THRESHOLD = 20
const NORMAL_CAUTION_PRECIPITATION_PROBABILITY_THRESHOLD = 30
const WHITE_PRECIPITATION_PROBABILITY_THRESHOLD = 60
const HIGH_HUMIDITY_THRESHOLD = 80
const STRONG_WIND_THRESHOLD = 8
const VERY_STRONG_WIND_THRESHOLD = 11

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

const buildLaundryJudgement = ({
  humidity,
  precipitationProbability,
  weatherCategory,
  windSpeed,
}: {
  humidity: number
  precipitationProbability: number
  weatherCategory: WeatherCategory
  windSpeed: number
}): LaundryJudgement => {
  const cautionReasons: string[] = []

  const isStrongWind = windSpeed >= STRONG_WIND_THRESHOLD
  const isVeryStrongWind = windSpeed >= VERY_STRONG_WIND_THRESHOLD
  const isHighHumidity = humidity >= HIGH_HUMIDITY_THRESHOLD
  const hasHighPrecipitationRisk = precipitationProbability >= WHITE_PRECIPITATION_PROBABILITY_THRESHOLD
  const hasModeratePrecipitationRisk = precipitationProbability >= NORMAL_CAUTION_PRECIPITATION_PROBABILITY_THRESHOLD
  const isClearLike = weatherCategory === 'clear' || weatherCategory === 'partlyCloudy'

  const severeWetCategories = new Set<WeatherCategory>(['thunderstorm', 'snow', 'snowShower', 'freezingRain', 'freezingDrizzle'])
  const wetCategories = new Set<WeatherCategory>(['drizzle', 'rain', 'rainShower'])
  const rainyCategories = new Set<WeatherCategory>(['drizzle', 'freezingDrizzle', 'rain', 'freezingRain', 'rainShower'])
  const shouldShowRainCaution = !rainyCategories.has(weatherCategory)

  // 1) まずは「濡れる・危険」系リスクを優先判定します。
  //    ここを先に評価することで、晴れ表示でも降水リスクが高い日は NG になります。
  if (severeWetCategories.has(weatherCategory) || hasHighPrecipitationRisk) {
    if (weatherCategory === 'thunderstorm') {
      cautionReasons.push('雷雨に注意')
    } else if (weatherCategory === 'snow' || weatherCategory === 'snowShower') {
      cautionReasons.push('雪に注意')
    } else if (shouldShowRainCaution) {
      cautionReasons.push('雨に注意')
    }

    if (isStrongWind) {
      cautionReasons.push('風に注意')
    }

    return {
      level: 'white',
      caution: cautionReasons.length > 0 ? cautionReasons.join('・') : undefined,
    }
  }

  if (wetCategories.has(weatherCategory) || hasModeratePrecipitationRisk) {
    if (shouldShowRainCaution) {
      cautionReasons.push('雨に注意')
    }

    if (isStrongWind) {
      cautionReasons.push('風に注意')
    }

    return {
      level: 'white',
      caution: cautionReasons.length > 0 ? cautionReasons.join('・') : undefined,
    }
  }

  // 2) 降水リスクが低い場合にのみ「乾きやすさ」を評価します。
  //    晴れ寄り・湿度低め・降水確率低め・風が極端に強くない、の4条件で Gold にします。
  if (
    isClearLike &&
    humidity < GOLD_HUMIDITY_THRESHOLD &&
    precipitationProbability < GOLD_PRECIPITATION_PROBABILITY_THRESHOLD &&
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

  // 3) それ以外は通常判定。
  //    ただし、乾きにくさの要因（湿度・風）は注意文として明示します。
  if (isHighHumidity) {
    cautionReasons.push('湿気に注意')
  }

  if (isStrongWind) {
    cautionReasons.push('風に注意')
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

const toWeatherForecastDays = (daily: OpenMeteoForecastResponse['daily']): WeatherForecastDay[] => {
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
    const weatherCode = daily.weather_code[index]
    const weatherDetail = getWeatherCodeDetail(weatherCode)
    const humidity = daily.relative_humidity_2m_mean[index]
    const precipitationProbability = daily.precipitation_probability_max[index]
    // APIから取得した風速はkm/h単位で返されます。
    // UI表示と洗濯判定はm/sで扱うため、ここでm/sに変換します。
    // 計算: km/h ÷ 3.6 = m/s
    const windSpeedKmh = daily.wind_speed_10m_max[index]
    const windSpeedMs = windSpeedKmh / 3.6
    const roundedWindSpeedMs = Math.round(windSpeedMs)

    return {
      date: daily.time[index],
      dateLabel: toDateLabel(daily.time[index]),
      isToday: index === 0,
      weatherCode,
      weatherEmoji: weatherDetail.emoji,
      weatherLabel: weatherDetail.label,
      maxTemperature: Math.round(daily.temperature_2m_max[index]),
      minTemperature: Math.round(daily.temperature_2m_min[index]),
      precipitationProbability: Math.round(daily.precipitation_probability_max[index]),
      windSpeed: roundedWindSpeedMs,
      humidity: Math.round(humidity),
      // UI表示値と判定値のズレを防ぐため、風速は丸め後のm/sで判定します。
      // 例: 表示が 8m/s なら、必ず「8m/s相当」の判定になります。
      laundry: buildLaundryJudgement({
        humidity,
        precipitationProbability,
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
  })

  const response = await fetch(`${OPEN_METEO_FORECAST_ENDPOINT}?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error('天気データの取得に失敗しました。')
  }

  const data = (await response.json()) as OpenMeteoForecastResponse

  if (!data.daily) {
    throw new Error('天気データの形式が不正です。')
  }

  return toWeatherForecastDays(data.daily)
}