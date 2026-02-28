import type { EventCountdownItem, EventCountdownItemInput, EventIconKey } from '@/features/event-countdown/types/eventCountdown'
import { getTodayDateString } from '@/features/event-countdown/utils/date'

const EVENT_COUNTDOWN_STORAGE_KEY = 'lifehub:event-countdown-items'

const isEventIconKey = (value: string): value is EventIconKey => {
  return value === 'sparkles' || value === 'fireworks' || value === 'gift' || value === 'plane' || value === 'music'
}

const normalizeStoredEventCountdownItem = (value: unknown): EventCountdownItem | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const candidate = value as Partial<EventCountdownItem> & {
    date?: string
  }

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.createdAt !== 'number' ||
    typeof candidate.iconKey !== 'string' ||
    !isEventIconKey(candidate.iconKey)
  ) {
    return null
  }

  // 旧データ（dateのみ保存）を読み込んだ場合は、開始日・終了日を同日に補完して互換維持します。
  if (typeof candidate.date === 'string') {
    return {
      id: candidate.id,
      title: candidate.title,
      startDate: candidate.date,
      endDate: candidate.date,
      iconKey: candidate.iconKey,
      createdAt: candidate.createdAt,
    }
  }

  if (typeof candidate.startDate !== 'string' || typeof candidate.endDate !== 'string') {
    return null
  }

  return (
    {
      id: candidate.id,
      title: candidate.title,
      startDate: candidate.startDate,
      endDate: candidate.endDate,
      iconKey: candidate.iconKey,
      createdAt: candidate.createdAt,
    }
  )
}

const readStoredItems = (): EventCountdownItem[] => {
  const rawStorageValue = localStorage.getItem(EVENT_COUNTDOWN_STORAGE_KEY)

  if (!rawStorageValue) {
    return []
  }

  try {
    const parsedItems = JSON.parse(rawStorageValue) as unknown

    if (!Array.isArray(parsedItems)) {
      localStorage.removeItem(EVENT_COUNTDOWN_STORAGE_KEY)
      return []
    }

    return parsedItems
      .map((item) => normalizeStoredEventCountdownItem(item))
      .filter((item): item is EventCountdownItem => item !== null)
  } catch {
    localStorage.removeItem(EVENT_COUNTDOWN_STORAGE_KEY)
    return []
  }
}

const writeStoredItems = (items: EventCountdownItem[]) => {
  localStorage.setItem(EVENT_COUNTDOWN_STORAGE_KEY, JSON.stringify(items))
}

// 将来DB連携へ置き換えるため、あえてAPI関数として切り出しています。
export const fetchEventCountdownItems = async (): Promise<EventCountdownItem[]> => {
  const storedItems = readStoredItems()
  const todayDateString = getTodayDateString()
  const validItems = storedItems.filter((item) => item.endDate >= todayDateString)

  if (validItems.length !== storedItems.length) {
    // 期限切れイベントを自動削除し、次回表示時に古いデータが残らないようにします。
    writeStoredItems(validItems)
  }

  return validItems.sort((firstItem, secondItem) => firstItem.startDate.localeCompare(secondItem.startDate))
}

export const createEventCountdownItem = async (
  input: EventCountdownItemInput
): Promise<EventCountdownItem> => {
  const newItem: EventCountdownItem = {
    id: crypto.randomUUID(),
    title: input.title,
    startDate: input.startDate,
    endDate: input.endDate,
    iconKey: input.iconKey,
    createdAt: Date.now(),
  }

  const storedItems = readStoredItems()
  writeStoredItems([...storedItems, newItem])

  return newItem
}

export const updateEventCountdownItem = async (
  eventId: string,
  input: EventCountdownItemInput
): Promise<EventCountdownItem> => {
  const storedItems = readStoredItems()
  const targetItem = storedItems.find((item) => item.id === eventId)

  if (!targetItem) {
    throw new Error('Event not found')
  }

  const updatedItem: EventCountdownItem = {
    ...targetItem,
    title: input.title,
    startDate: input.startDate,
    endDate: input.endDate,
    iconKey: input.iconKey,
  }

  const nextItems = storedItems.map((item) => (item.id === eventId ? updatedItem : item))
  writeStoredItems(nextItems)

  return updatedItem
}

export const deleteEventCountdownItem = async (eventId: string): Promise<void> => {
  const storedItems = readStoredItems()
  const nextItems = storedItems.filter((item) => item.id !== eventId)
  writeStoredItems(nextItems)
}
