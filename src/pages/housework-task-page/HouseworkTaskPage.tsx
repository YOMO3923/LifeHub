import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'

// 準備中の機能でも、実装予定を文章で示すとユーザーが次のアップデートを理解しやすくなります。
const DESCRIPTION =
  '家事管理機能は現在準備中です。ルーチンタスクとスポットタスクをまとめて管理できるように実装予定です。'

export const HouseworkTaskPage = () => {
  // 共通部品に title/description を渡すだけにして、各ページを薄く保つ設計です。
  return <FeaturePlaceholderPage title="Housework Task" description={DESCRIPTION} />
}
