import { Plane } from 'lucide-react'
import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'

// 機能概要を先に見せることで、未実装ページでも「何が入るか」を利用者に伝えられます。
const DESCRIPTION =
  'Pre-Travel 機能は現在準備中です。持ち物チェックと行きたい・行った場所の管理をこのページで扱う予定です。'

export const PreTravelPage = () => {
  // 共通のレイアウトコンポーネントを使い、画面体験を統一します。
  return <FeaturePlaceholderPage title="Pre-Travel" description={DESCRIPTION} cardIcon={Plane} />
}
