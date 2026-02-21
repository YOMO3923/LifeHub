import { UtensilsCrossed } from 'lucide-react'
import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'

// 具体的な利用シーン（献立/買い物/レシピ）を書いておくと、機能目的が初見でも伝わりやすいです。
const DESCRIPTION = '料理サポート機能は現在準備中です。献立表・買い物リスト・レシピ管理をこの画面に追加予定です。'

export const CookingSupportPage = () => {
  // ページ本体は共通プレースホルダーへ委譲し、ここでは文言定義だけに責務を絞っています。
  return <FeaturePlaceholderPage title="Cooking Support" description={DESCRIPTION} cardIcon={UtensilsCrossed} />
}
