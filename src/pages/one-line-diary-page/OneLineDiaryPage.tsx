import { BookOpenText } from 'lucide-react'
import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'

// この定数は「今は準備中であること」をユーザーへ明確に伝えるための文言です。
const DESCRIPTION =
  'One-Line Diary 機能は現在準備中です。カレンダーから日付を選び、当日と過去日に一言を残せる形で実装予定です。'

export const OneLineDiaryPage = () => {
  // 共通プレースホルダーを再利用することで、ページごとのデザイン差分を最小化し保守しやすくします。
  return <FeaturePlaceholderPage title="One-Line Diary" description={DESCRIPTION} cardIcon={BookOpenText} />
}
