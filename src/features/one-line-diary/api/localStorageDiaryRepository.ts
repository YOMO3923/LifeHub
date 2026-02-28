import type { DiaryRepository } from '@/features/one-line-diary/types/diaryRepository'
import type { DiaryMap } from '@/features/one-line-diary/types/oneLineDiary'

const ONE_LINE_DIARY_STORAGE_KEY = 'lifehub:one-line-diary-map'

const isDiaryMapRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const normalizeDiaryMap = (rawValue: unknown): DiaryMap => {
  if (!isDiaryMapRecord(rawValue)) {
    return {}
  }

  // 値が string のものだけを採用し、不正データ混入時も安全に復元できるようにします。
  return Object.entries(rawValue).reduce<DiaryMap>((resultMap, [key, value]) => {
    if (typeof value !== 'string') {
      return resultMap
    }

    resultMap[key] = value
    return resultMap
  }, {})
}

const readDiaryMapFromStorage = (): DiaryMap => {
  const storageValue = localStorage.getItem(ONE_LINE_DIARY_STORAGE_KEY)

  if (!storageValue) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(storageValue) as unknown
    return normalizeDiaryMap(parsedValue)
  } catch {
    // 壊れたJSONでアプリ全体が停止しないよう、空データへフォールバックします。
    localStorage.removeItem(ONE_LINE_DIARY_STORAGE_KEY)
    return {}
  }
}

const writeDiaryMapToStorage = (diaryMap: DiaryMap) => {
  localStorage.setItem(ONE_LINE_DIARY_STORAGE_KEY, JSON.stringify(diaryMap))
}

export class LocalStorageDiaryRepository implements DiaryRepository {
  async loadAll(): Promise<DiaryMap> {
    // SUPABASE_MIGRATION_POINT: 読み込み
    return readDiaryMapFromStorage()
  }

  async saveByDate(dateKey: string, text: string): Promise<void> {
    // SUPABASE_MIGRATION_POINT: 保存
    const currentDiaryMap = readDiaryMapFromStorage()
    const nextDiaryMap: DiaryMap = {
      ...currentDiaryMap,
      [dateKey]: text,
    }

    writeDiaryMapToStorage(nextDiaryMap)
  }
}

export const localStorageDiaryRepository = new LocalStorageDiaryRepository()
