// 曜日ルーチン家事。曜日を持つことで、当日タスクを自動生成する拡張がしやすくなります。
export type HouseworkRoutineTask = {
  id: string
  title: string
  weekday: number
}

// 単発家事。日付を直接持たせることで、ルーチンとは別の管理軸を明確に分離します。
export type HouseworkSpotTask = {
  date: string
  id: string
  title: string
}

// 画面では両者をまとめて扱えるよう、合成型を1つ用意しておきます。
export type HouseworkTask = {
  id: string
  isDone: boolean
  scheduledDate: string
  title: string
}
