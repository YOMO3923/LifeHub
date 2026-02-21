import { useCallback, useState } from 'react'
import {
  fetchOneLineDiaryEntries,
  upsertOneLineDiaryEntry,
} from '@/features/one-line-diary/api/oneLineDiaryApi'
import type {
  OneLineDiaryEntry,
  OneLineDiaryEntryInput,
} from '@/features/one-line-diary/types/oneLineDiary'

export const useOneLineDiary = () => {
  const [entries, setEntries] = useState<OneLineDiaryEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 読み込み処理をhook側へ寄せることで、コンポーネントは「表示」に集中できます。
  const loadEntries = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const fetchedEntries = await fetchOneLineDiaryEntries()
      setEntries(fetchedEntries)
    } catch {
      setErrorMessage('日記の取得に失敗しました。時間をおいて再試行してください。')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 保存後に state を同期することで、再読み込みしなくても画面へ即時反映できます。
  const saveEntry = useCallback(async (input: OneLineDiaryEntryInput) => {
    const savedEntry = await upsertOneLineDiaryEntry(input)

    setEntries((currentEntries) => {
      const hasSameDateEntry = currentEntries.some((entry) => entry.date === savedEntry.date)

      if (!hasSameDateEntry) {
        return [savedEntry, ...currentEntries]
      }

      return currentEntries.map((entry) =>
        entry.date === savedEntry.date ? savedEntry : entry
      )
    })
  }, [])

  return {
    entries,
    isLoading,
    errorMessage,
    loadEntries,
    saveEntry,
  }
}
