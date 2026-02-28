import { localStorageDiaryRepository } from '@/features/one-line-diary/api/localStorageDiaryRepository'
import type { DiaryMap } from '@/features/one-line-diary/types/oneLineDiary'

// 既存構成との互換用ファサードです。
// 新規実装は DiaryRepository を直接利用し、このファイルは段階移行の中継として残します。
export const fetchOneLineDiaryMap = async (): Promise<DiaryMap> => {
  return localStorageDiaryRepository.loadAll()
}

export const upsertOneLineDiaryByDate = async (dateKey: string, note: string): Promise<void> => {
  await localStorageDiaryRepository.saveByDate(dateKey, note)
}
