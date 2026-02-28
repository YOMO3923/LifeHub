import { Sparkles } from 'lucide-react'
import { AppHeader } from '@/components/common/AppHeader'
import { OneLineDiaryPanel } from '@/features/one-line-diary'

export const OneLineDiaryPage = () => {
  return (
    // ポータルと同じグラデーション背景を使い、機能間を移動しても統一感を維持します。
    <main className="min-h-screen bg-gradient-to-br from-gold/35 via-charcoal/55 to-navy/75 animate-in fade-in duration-500">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-10 animate-in slide-in-from-bottom-2 duration-700">
        <AppHeader
          title="LifeHub"
          canGoBack
          centerIcon={
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-gold bg-navy-gradient shadow-sm sm:h-14 sm:w-14">
              <Sparkles className="h-7 w-7 text-gold sm:h-8 sm:w-8" />
            </span>
          }
        />

        <p className="-mt-2 text-center text-lg font-medium tracking-[0.35em] text-navy/80 uppercase sm:text-xl">
          One-Line Diary
        </p>

        <OneLineDiaryPanel />
      </div>
    </main>
  )
}
