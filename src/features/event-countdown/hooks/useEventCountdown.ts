import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createEventCountdownItem,
  deleteEventCountdownItem,
  fetchEventCountdownItems,
  updateEventCountdownItem,
} from '@/features/event-countdown/api/eventCountdownApi'
import type {
  EventCountdownItem,
  EventCountdownItemInput,
  UpcomingEventCountdownItem,
} from '@/features/event-countdown/types/eventCountdown'

const MS_PER_DAY = 24 * 60 * 60 * 1000

const toStartOfDay = (dateString: string) => {
  return new Date(`${dateString}T00:00:00`)
}

const getTodayDateString = () => {
  // 入力フォームの date 値に合わせ、YYYY-MM-DD 形式で本日を作ります。
  return new Date().toISOString().slice(0, 10)
}

export const useEventCountdown = () => {
  const [eventItems, setEventItems] = useState<EventCountdownItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // 日付が変わったときにカウントダウンを強制再計算するためのキー。
  // 手動の再読み込みやアプリ起動時に更新します。
  const [refreshKey, setRefreshKey] = useState(0)

  const loadEventItems = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const fetchedItems = await fetchEventCountdownItems()
      setEventItems(fetchedItems)
      // データ読み込み完了時に refreshKey を更新し、
      // useMemo で依存配列を通じて再計算を強制します。
      setRefreshKey((prev) => prev + 1)
    } catch {
      setErrorMessage('イベント一覧の取得に失敗しました。時間をおいて再試行してください。')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadEventItems()
  }, [loadEventItems])

  const validateEventItemInput = useCallback((input: EventCountdownItemInput) => {
    const normalizedTitle = input.title.trim()
    const todayDateString = getTodayDateString()

    if (!normalizedTitle) {
      setErrorMessage('イベント名を入力してください。')
      return null
    }

    if (!input.date) {
      setErrorMessage('日程を入力してください。')
      return null
    }

    if (input.date < todayDateString) {
      setErrorMessage('本日以降の日程を入力してください。')
      return null
    }

    return {
      ...input,
      title: normalizedTitle,
    }
  }, [])

  const createEventItem = useCallback(async (input: EventCountdownItemInput) => {
    const validatedInput = validateEventItemInput(input)

    if (!validatedInput) {
      return false
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const savedItem = await createEventCountdownItem({
        title: validatedInput.title,
        date: validatedInput.date,
        iconKey: validatedInput.iconKey,
      })

      setEventItems((currentItems) => {
        const nextItems = [...currentItems, savedItem]
        return nextItems.sort((firstItem, secondItem) => firstItem.date.localeCompare(secondItem.date))
      })

      return true
    } catch {
      setErrorMessage('イベントの保存に失敗しました。時間をおいて再試行してください。')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [validateEventItemInput])

  const updateEventItem = useCallback(async (eventId: string, input: EventCountdownItemInput) => {
    const validatedInput = validateEventItemInput(input)

    if (!validatedInput) {
      return false
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const updatedItem = await updateEventCountdownItem(eventId, {
        title: validatedInput.title,
        date: validatedInput.date,
        iconKey: validatedInput.iconKey,
      })

      setEventItems((currentItems) => {
        const nextItems = currentItems.map((item) => {
          if (item.id !== eventId) {
            return item
          }

          return updatedItem
        })

        return nextItems.sort((firstItem, secondItem) => firstItem.date.localeCompare(secondItem.date))
      })

      return true
    } catch {
      setErrorMessage('イベントの更新に失敗しました。時間をおいて再試行してください。')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [validateEventItemInput])

  const deleteEventItem = useCallback(async (eventId: string) => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await deleteEventCountdownItem(eventId)
      setEventItems((currentItems) => currentItems.filter((item) => item.id !== eventId))
      return true
    } catch {
      setErrorMessage('イベントの削除に失敗しました。時間をおいて再試行してください。')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const upcomingEventItems = useMemo<UpcomingEventCountdownItem[]>(() => {
    // refreshKey は日付が変わった時のカウントダウン再計算をトリガーするために必要な依存です。
    // eslint-disable react-hooks/exhaustive-deps
    const todayStart = toStartOfDay(getTodayDateString()).getTime()

    return eventItems
      .map((eventItem) => {
        const eventStart = toStartOfDay(eventItem.date).getTime()
        const daysUntil = Math.ceil((eventStart - todayStart) / MS_PER_DAY)

        return {
          ...eventItem,
          daysUntil,
        }
      })
      .filter((eventItem) => eventItem.daysUntil >= 0)
      .sort((firstItem, secondItem) => firstItem.daysUntil - secondItem.daysUntil)
  }, [eventItems, refreshKey])

  const highlightedEvent = upcomingEventItems[0] ?? null

  // ユーザーが手動でイベント一覧を再読み込みするための関数です。
  // 日付が変わったと思われる場合に、これを呼び出すことで
  // カウントダウンを強制的に再計算できます。
  const refreshEventItems = useCallback(() => {
    void loadEventItems()
  }, [loadEventItems])

  return {
    highlightedEvent,
    eventItems,
    upcomingEventItems,
    isLoading,
    isSubmitting,
    errorMessage,
    loadEventItems,
    refreshEventItems,
    createEventItem,
    updateEventItem,
    deleteEventItem,
  }
}
