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
const STRONG_WIND_THRESHOLD = 8

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

const SUNNY_WEATHER_CODES = new Set([0, 1])
const RAINY_WEATHER_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
])

const getWeatherLabel = (weatherCode: number) => {
  if (weatherCode === 0) {
    return '快晴'
  }

  if (weatherCode === 1) {
    return '晴れ'
  }

  if (weatherCode === 2) {
    return '薄曇り'
  }

  if (weatherCode === 3) {
    return '曇り'
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return '霧'
  }

  if (RAINY_WEATHER_CODES.has(weatherCode)) {
    return '雨'
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return '雪'
  }

  return '天気情報'
}

const getWeatherEmoji = (weatherCode: number) => {
  if (weatherCode === 0 || weatherCode === 1) {
    return '☀️'
  }

  if (weatherCode === 2) {
    return '🌤️'
  }

  if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
    return '☁️'
  }

  if (RAINY_WEATHER_CODES.has(weatherCode)) {
    return '🌧️'
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return '❄️'
  }

  return '🌈'
}

const buildLaundryJudgement = ({
  humidity,
  precipitationProbability,
  weatherCode,
  windSpeed,
}: {
  humidity: number
  precipitationProbability: number
  weatherCode: number
  windSpeed: number
}): LaundryJudgement => {
  const isSunny = SUNNY_WEATHER_CODES.has(weatherCode)
  const isRainy = RAINY_WEATHER_CODES.has(weatherCode)

  // 判定の最優先は「濡れるリスク」です。
  // 天気コードで雨と判定された場合は、降水確率の値に関わらず外干し非推奨にします。
  // これにより、天気コードと UI表示の矛盾を解決します。
  if (isRainy) {
    const isWindCaution = windSpeed >= STRONG_WIND_THRESHOLD
    if (isWindCaution) {
      return {
        level: 'white',
        caution: '風に注意',
      }
    }
    return {
      level: 'white',
      // caution: '雨に注意',
    }
  }

  // 降水確率が高い場合も外干し非推奨にします。
  if (precipitationProbability >= WHITE_PRECIPITATION_PROBABILITY_THRESHOLD) {
    const isWindCaution = windSpeed >= STRONG_WIND_THRESHOLD
    if (isWindCaution) {
      return {
        level: 'white',
        caution: '風に注意',
      }
    }
    return {
      level: 'white',
      // caution: '雨に注意',
    }
  }

  // 乾きやすさと雨リスクの両方を満たす場合のみ Gold 判定にします。
  if (
    humidity < GOLD_HUMIDITY_THRESHOLD &&
    precipitationProbability < GOLD_PRECIPITATION_PROBABILITY_THRESHOLD &&
    isSunny
  ) {
    // Gold判定でも風が強い場合は注意を表示します
    const isWindCaution = windSpeed >= STRONG_WIND_THRESHOLD
    if (isWindCaution) {
      return {
        level: 'gold',
        caution: '風に注意',
      }
    }

    return {
      level: 'gold',
    }
  }

  // 中間状態は「通常判定」として返し、外干し可否をユーザーが判断しやすくします。
  // 風速が強い日は飛散・型崩れリスクがあるため、補足メッセージを分けています。
  const isWindCaution = windSpeed >= STRONG_WIND_THRESHOLD
  const isPrecipitationCaution = precipitationProbability >= NORMAL_CAUTION_PRECIPITATION_PROBABILITY_THRESHOLD

  if (isWindCaution && isPrecipitationCaution) {
    return {
      level: 'white',
      caution: '風・雨に注意',
    }
  }

  if (isWindCaution) {
    return {
      level: 'normal',
      caution: '風に注意',
    }
  }

  if (isPrecipitationCaution) {
    return {
      level: 'white',
      // caution: '雨に注意',
    }
  }

  return {
    level: 'normal',
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
    const humidity = daily.relative_humidity_2m_mean[index]
    const precipitationProbability = daily.precipitation_probability_max[index]
    // APIから取得した風速はkm/h単位で返されます。
    // UI表示と洗濯判定はm/sで扱うため、ここでm/sに変換します。
    // 計算: km/h ÷ 3.6 = m/s
    const windSpeedKmh = daily.wind_speed_10m_max[index]
    const windSpeedMs = windSpeedKmh / 3.6

    return {
      date: daily.time[index],
      dateLabel: toDateLabel(daily.time[index]),
      isToday: index === 0,
      weatherCode,
      weatherEmoji: getWeatherEmoji(weatherCode),
      weatherLabel: getWeatherLabel(weatherCode),
      maxTemperature: Math.round(daily.temperature_2m_max[index]),
      minTemperature: Math.round(daily.temperature_2m_min[index]),
      precipitationProbability: Math.round(daily.precipitation_probability_max[index]),
      windSpeed: Math.round(windSpeedMs),
      humidity: Math.round(humidity),
      // laundryJudgement の計算はm/s単位の値を使用しています。
      // 気象学的な基準値（STRONG_WIND_THRESHOLD = 8 m/s）がm/s単位のためです。
      laundry: buildLaundryJudgement({ humidity, precipitationProbability, weatherCode, windSpeed: windSpeedMs }),
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