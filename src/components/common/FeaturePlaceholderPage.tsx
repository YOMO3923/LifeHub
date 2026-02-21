import { Sparkles } from 'lucide-react'
import { AppHeader } from '@/components/common/AppHeader'

type FeaturePlaceholderPageProps = {
  cardIcon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

export const FeaturePlaceholderPage = ({ cardIcon: CardIcon, title, description }: FeaturePlaceholderPageProps) => {
  return (
    // ポータルと同じ背景トーンに揃えることで、別ページへ遷移しても同一アプリ内だと認識しやすくなります。
    <main className="min-h-screen bg-gradient-to-br from-gold/35 via-charcoal/55 to-navy/75 animate-in fade-in duration-500">
      {/* max-w + 中央寄せで、PCの横長画面でもコンテンツ幅を読みやすく保ちます。 */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-10 pt-10 animate-in slide-in-from-bottom-2 duration-700">
        <AppHeader
          title="LifeHub"
          canGoBack
          centerIcon={
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-gold bg-navy-gradient shadow-sm sm:h-14 sm:w-14">
              <Sparkles className="h-7 w-7 text-gold sm:h-8 sm:w-8" />
            </span>
          }
        />

        <p className="-mt-2 text-center text-lg font-medium tracking-[0.35em] text-navy/80 uppercase sm:text-xl">{title}</p>

        {/* このセクションは「今後ここに機能を実装する」というプレースホルダー領域です。 */}
        <section className="rounded-3xl border-[0.5px] border-gold bg-navy/80 p-8 text-gold backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-2 duration-700 sm:p-10">
          <div className="flex items-center justify-center gap-2 text-center">
            <CardIcon className="h-5 w-5 text-gold sm:h-6 sm:w-6" />
            <h2 className="text-lg font-semibold tracking-[0.06em] text-white sm:text-xl">{title}</h2>
          </div>
          <p className="mt-4 text-lg leading-relaxed text-white">{description}</p>
        </section>
      </div>
    </main>
  )
}
