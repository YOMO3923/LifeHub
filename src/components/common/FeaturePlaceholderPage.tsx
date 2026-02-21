import { AppHeader } from '@/components/common/AppHeader'

type FeaturePlaceholderPageProps = {
  title: string
  description: string
}

export const FeaturePlaceholderPage = ({ title, description }: FeaturePlaceholderPageProps) => {
  return (
    // ポータルと同じ背景トーンに揃えることで、別ページへ遷移しても同一アプリ内だと認識しやすくなります。
    <main className="min-h-screen bg-gradient-to-br from-gold/35 via-charcoal/55 to-navy/75 animate-in fade-in duration-500">
      {/* max-w + 中央寄せで、PCの横長画面でもコンテンツ幅を読みやすく保ちます。 */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-10 pt-10 animate-in slide-in-from-bottom-2 duration-700">
        <AppHeader title={title} canGoBack />

        {/* このセクションは「今後ここに機能を実装する」というプレースホルダー領域です。 */}
        <section className="rounded-3xl border-[0.5px] border-gold bg-navy/80 p-8 text-gold backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-2 duration-700 sm:p-10">
          <p className="text-lg leading-relaxed text-white">{description}</p>
        </section>
      </div>
    </main>
  )
}
