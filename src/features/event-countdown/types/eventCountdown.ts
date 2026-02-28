// localStorage へ保存する1件分のイベントデータです。
// 将来DBへ移行する際も、この型を基準にマッピングすれば画面側の修正を最小化できます。
export type EventCountdownItem = {
  createdAt: number
  endDate: string
  iconKey: EventIconKey
  id: string
  startDate: string
  title: string
}

// 保存時に画面から渡す入力値です。
// id/createdAt は保存層で採番するため、入力型からは除外します。
export type EventCountdownItemInput = {
  endDate: string
  iconKey: EventIconKey
  startDate: string
  title: string
}

// フォームの編集中データ。入力途中の状態管理専用です。
export type EventCountdownDraft = {
  endDate: string
  iconKey: EventIconKey
  startDate: string
  title: string
}

// 画面に表示するために「あと何日」を合成した型です。
export type UpcomingEventCountdownItem = EventCountdownItem & {
  daysUntil: number
}

// アイコン選択のキーは union で固定し、タイプミスをコンパイル時に防ぎます。
export type EventIconKey = 'fireworks' | 'gift' | 'music' | 'plane' | 'sparkles'
