// 1件の日記データ。UIとAPIの両方で使う共通の型として定義しておくと、仕様変更時の修正漏れを減らせます。
export type OneLineDiaryEntry = {
  date: string
  id: string
  note: string
}

// 保存時にユーザーが入力する最小単位。id はサーバー側で採番されることを想定して分離します。
export type OneLineDiaryEntryInput = {
  date: string
  note: string
}

// フォームの一時状態。入力途中に使う型を分けると、フォーム拡張時に責務が明確になります。
export type OneLineDiaryDraft = {
  note: string
}
