import { useCallback, useEffect, useMemo, useState } from 'react'
import { localStorageDiaryRepository } from '@/features/one-line-diary/api/localStorageDiaryRepository'
import { buildMonthCalendarCells, toDateKey } from '@/features/one-line-diary/utils/date'
import type { DiaryRepository } from '@/features/one-line-diary/types/diaryRepository'
import type { DiaryMap } from '@/features/one-line-diary/types/oneLineDiary'

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
})

export const useOneLineDiary = (repository: DiaryRepository = localStorageDiaryRepository) => {
  const [diaryMap, setDiaryMap] = useState<DiaryMap>({})
  const [viewMonth, setViewMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [draftNote, setDraftNote] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const today = useMemo(() => new Date(), [])

  const loadDiaryMap = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const loadedDiaryMap = await repository.loadAll()
      setDiaryMap(loadedDiaryMap)
    } catch {
      setErrorMessage('日記の読み込みに失敗しました。時間をおいて再試行してください。')
    } finally {
      setIsLoading(false)
    }
  }, [repository])

  // 初回表示時に永続化データを復元する責務です。
  useEffect(() => {
    void loadDiaryMap()
  }, [loadDiaryMap])

  const selectedDateKey = useMemo(() => {
    if (!selectedDate) {
      return null
    }

    return toDateKey(selectedDate)
  }, [selectedDate])

  // 選択日が変わった時に、その日の既存メモを入力欄へ反映する責務です。
  useEffect(() => {
    if (!selectedDateKey) {
      setDraftNote('')
      return
    }

    setDraftNote(diaryMap[selectedDateKey] ?? '')
  }, [diaryMap, selectedDateKey])

  const calendarCells = useMemo(() => {
    return buildMonthCalendarCells(viewMonth, today)
  }, [today, viewMonth])

  const monthLabel = useMemo(() => {
    return MONTH_LABEL_FORMATTER.format(viewMonth)
  }, [viewMonth])

  const openDiaryModal = useCallback((date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }, [])

  const closeDiaryModal = useCallback(() => {
    setIsModalOpen(false)
    setErrorMessage(null)
  }, [])

  const goPrevMonth = useCallback(() => {
    setViewMonth((currentMonth) => {
      return new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    })
  }, [])

  const goNextMonth = useCallback(() => {
    setViewMonth((currentMonth) => {
      return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    })
  }, [])

  const handleChangeDraftNote = useCallback((value: string) => {
    setDraftNote(value)
  }, [])

  const saveDiaryForSelectedDate = useCallback(async () => {
    if (!selectedDateKey) {
      setErrorMessage('保存する日付を選択してください。')
      return false
    }

    const normalizedNote = draftNote.trim()

    if (!normalizedNote) {
      setErrorMessage('一言日記を入力してください。')
      return false
    }

    setIsSaving(true)
    setErrorMessage(null)

    try {
      await repository.saveByDate(selectedDateKey, normalizedNote)

      setDiaryMap((currentMap) => ({
        ...currentMap,
        [selectedDateKey]: normalizedNote,
      }))

      setIsModalOpen(false)
      return true
    } catch {
      setErrorMessage('日記の保存に失敗しました。時間をおいて再試行してください。')
      return false
    } finally {
      setIsSaving(false)
    }
  }, [draftNote, repository, selectedDateKey])

  return {
    diaryMap,
    viewMonth,
    monthLabel,
    selectedDate,
    selectedDateKey,
    draftNote,
    isModalOpen,
    calendarCells,
    isLoading,
    isSaving,
    errorMessage,
    loadDiaryMap,
    openDiaryModal,
    closeDiaryModal,
    goPrevMonth,
    goNextMonth,
    handleChangeDraftNote,
    saveDiaryForSelectedDate,
  }
}
