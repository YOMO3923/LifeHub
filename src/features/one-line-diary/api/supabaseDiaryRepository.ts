import type { DiaryRepository } from '@/features/one-line-diary/types/diaryRepository'
import type { DiaryMap } from '@/features/one-line-diary/types/oneLineDiary'

export class SupabaseDiaryRepository implements DiaryRepository {
  async loadAll(): Promise<DiaryMap> {
    // SUPABASE_MIGRATION_POINT: 読み込み
    // TODO: Supabase クライアントを使って、ログインユーザーの日記一覧を取得する。
    // SUPABASE_MIGRATION_POINT: 認証ユーザーIDの紐付け
    throw new Error('SupabaseDiaryRepository.loadAll は未実装です。')
  }

  async saveByDate(dateKey: string, text: string): Promise<void> {
    // SUPABASE_MIGRATION_POINT: 保存
    // TODO: dateKey + text を Supabase に upsert する。
    // SUPABASE_MIGRATION_POINT: 認証ユーザーIDの紐付け
    void dateKey
    void text
    throw new Error('SupabaseDiaryRepository.saveByDate は未実装です。')
  }
}

export const supabaseDiaryRepository = new SupabaseDiaryRepository()
