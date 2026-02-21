import type {
  OneLineDiaryEntry,
  OneLineDiaryEntryInput,
} from '@/features/one-line-diary/types/oneLineDiary'

// ここは将来バックエンド通信へ置き換える前提の仮APIです。
// 先に関数シグネチャを固定しておくと、UI実装を先行して進めやすくなります。
export const fetchOneLineDiaryEntries = async (): Promise<OneLineDiaryEntry[]> => {
  return []
}

// 作成・更新を1つの関数に寄せることで、画面側は「保存する」という意図だけに集中できます。
export const upsertOneLineDiaryEntry = async (
  input: OneLineDiaryEntryInput
): Promise<OneLineDiaryEntry> => {
  return {
    id: crypto.randomUUID(),
    date: input.date,
    note: input.note,
  }
}
