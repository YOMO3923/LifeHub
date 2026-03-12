import { Wallet } from 'lucide-react'
import { FeaturePlaceholderPage } from '@/components/common/FeaturePlaceholderPage'

// 支出カテゴリと日付ごとの記録を一元管理できるようにするための準備ページです。
const DESCRIPTION = '支出管理機能は現在準備中です。日々の支出入力、カテゴリ別の集計、月次の振り返りをこの画面で扱う予定です。'

export const ExpenseManagerPage = () => {
  // 共通プレースホルダーを使い、ポータルから遷移した時の体験を既存ページと揃えます。
  return <FeaturePlaceholderPage title="Expense Manager" description={DESCRIPTION} cardIcon={Wallet} />
}
