import { NotebookPen } from 'lucide-react'
import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'

// アイデアや買い物メモなどを素早く残せる機能を配置する予定のページです。
const DESCRIPTION = 'メモ機能は現在準備中です。フリーメモの作成、編集、一覧管理をこの画面に追加予定です。'

export const MemoPage = () => {
  // 既存の未実装ページと同じコンポーネントを使い、UIの統一感を維持します。
  return <FeaturePlaceholderPage title="Memo" description={DESCRIPTION} cardIcon={NotebookPen} />
}
