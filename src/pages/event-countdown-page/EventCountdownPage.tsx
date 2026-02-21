import { Sparkles } from 'lucide-react'
import { AppHeader } from '@/components/common/AppHeader'
import { EventCountdownPanel } from '@/features/event-countdown'

export const EventCountdownPage = () => {
  return (
    // ポータルと同じ背景トーンを使い、機能ページ間の一貫した体験を保ちます。
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
          Event Countdown
        </p>

        <EventCountdownPanel />
      </div>
    </main>
  )
}
