// dateKey(YYYY-MM-DD) をキーにした日記データ本体です。
// 連想配列にしておくと、カレンダー上で「この日付にデータがあるか」を O(1) で判定できます。
export type DiaryMap = Record<string, string>

// モーダル入力中の一時状態です。
// 本体データ(DiaryMap)と分けることで「未保存入力」を安全に扱えます。
export type OneLineDiaryDraft = {
  note: string
}

// カレンダー1セルに必要な表示情報をまとめた型です。
// 表示ロジックをUI側から切り離し、責務を明確化するために定義しています。
export type CalendarDateCell = {
  date: Date
  dateKey: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  isFuture: boolean
}
