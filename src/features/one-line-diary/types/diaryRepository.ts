import type { DiaryMap } from '@/features/one-line-diary/types/oneLineDiary'

// 永続化手段を抽象化するインターフェースです。
// 画面側はこの契約だけを知ればよく、localStorage / Supabase の差し替えを容易にします。
export interface DiaryRepository {
  loadAll(): Promise<DiaryMap>
  saveByDate(dateKey: string, text: string): Promise<void>
}
