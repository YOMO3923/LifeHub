import type { EventCountdownItem, EventCountdownItemInput, EventIconKey } from '@/features/event-countdown/types/eventCountdown'
import { getTodayDateString } from '@/features/event-countdown/utils/date'

const EVENT_COUNTDOWN_STORAGE_KEY = 'lifehub:event-countdown-items'

const isEventIconKey = (value: string): value is EventIconKey => {
  return value === 'sparkles' || value === 'fireworks' || value === 'gift' || value === 'plane' || value === 'music'
}

const isEventCountdownItem = (value: unknown): value is EventCountdownItem => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<EventCountdownItem>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.date === 'string' &&
    typeof candidate.createdAt === 'number' &&
    typeof candidate.iconKey === 'string' &&
    isEventIconKey(candidate.iconKey)
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

    return parsedItems.filter((item) => isEventCountdownItem(item))
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
  const validItems = storedItems.filter((item) => item.date >= todayDateString)

  if (validItems.length !== storedItems.length) {
    // 期限切れイベントを自動削除し、次回表示時に古いデータが残らないようにします。
    writeStoredItems(validItems)
  }

  return validItems.sort((firstItem, secondItem) => firstItem.date.localeCompare(secondItem.date))
}

export const createEventCountdownItem = async (
  input: EventCountdownItemInput
): Promise<EventCountdownItem> => {
  const newItem: EventCountdownItem = {
    id: crypto.randomUUID(),
    title: input.title,
    date: input.date,
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
    date: input.date,
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
