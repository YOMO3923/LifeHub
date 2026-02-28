import type { CalendarDateCell } from '@/features/one-line-diary/types/oneLineDiary'

const CALENDAR_CELL_COUNT = 42

export const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const

const toStartOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// localStorage のキーと入力 date の形式(YYYY-MM-DD)を統一するための関数です。
export const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const isSameDay = (leftDate: Date, rightDate: Date) => {
  return toDateKey(leftDate) === toDateKey(rightDate)
}

export const isFutureDate = (targetDate: Date, today = new Date()) => {
  return toStartOfDay(targetDate).getTime() > toStartOfDay(today).getTime()
}

// カレンダーを常に 6 週(42セル)で描画すると、月切り替え時にレイアウトが跳ねずUXが安定します。
export const buildMonthCalendarCells = (viewMonth: Date, today = new Date()): CalendarDateCell[] => {
  const monthStartDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const monthStartWeekday = monthStartDate.getDay()
  const calendarStartDate = new Date(
    monthStartDate.getFullYear(),
    monthStartDate.getMonth(),
    monthStartDate.getDate() - monthStartWeekday
  )

  return Array.from({ length: CALENDAR_CELL_COUNT }, (_, index) => {
    const cellDate = new Date(
      calendarStartDate.getFullYear(),
      calendarStartDate.getMonth(),
      calendarStartDate.getDate() + index
    )

    return {
      date: cellDate,
      dateKey: toDateKey(cellDate),
      dayNumber: cellDate.getDate(),
      isCurrentMonth:
        cellDate.getFullYear() === viewMonth.getFullYear() &&
        cellDate.getMonth() === viewMonth.getMonth(),
      isToday: isSameDay(cellDate, today),
      isFuture: isFutureDate(cellDate, today),
    }
  })
}
