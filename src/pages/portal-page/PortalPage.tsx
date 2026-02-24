import { BookOpenText, CalendarClock, ClipboardList, CloudSun, Plane, RefreshCw, Sparkles, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppHeader } from '@/components/common/AppHeader'
import { Button } from '@/components/ui'
import { useEventCountdown } from '@/features/event-countdown'
import type { LaundryLevel, WeatherLocationKey } from '@/features/weather'
import { WEATHER_LOCATION_OPTIONS, useWeather } from '@/features/weather'
import { cn } from '@/lib/utils'
import goldLaundryImg from '@/assets/sokkan.jpg'
import normalLaundryImg from '@/assets/OK.jpg'
import whiteLaundryImg from '@/assets/NG.jpg'

type PortalFeature = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  to: string
}

const PORTAL_FEATURES: PortalFeature[] = [
  {
    title: 'One-Line Diary',
    icon: BookOpenText,
    to: '/one-line-diary',
  },
  {
    title: 'Housework Task',
    icon: ClipboardList,
    to: '/housework-task',
  },
  {
    title: 'Pre-Travel',
    icon: Plane,
    to: '/pre-travel',
  },
  {
    title: 'Cooking Support',
    icon: UtensilsCrossed,
    to: '/cooking-support',
  },
  {
    title: 'Event Countdown',
    icon: CalendarClock,
    to: '/event-countdown',
  },
]

const LAUNDRY_IMAGE_BY_LEVEL: Record<LaundryLevel, string> = {
  gold: goldLaundryImg,
  normal: normalLaundryImg,
  white: whiteLaundryImg,
}

export const PortalPage = () => {
  const { weatherDays, isLoading, errorMessage, selectedLocation, handleChangeLocation, retryLoadWeather } = useWeather()
  const { highlightedEvent, refreshEventItems } = useEventCountdown()

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleChangeLocation(event.target.value as WeatherLocationKey)
  }

  return (
    // 画面全体の背景。from/via/to の3色グラデーションで単色より奥行き感を作っています。
    <main className="min-h-screen bg-gradient-to-br from-gold/35 via-charcoal/55 to-navy/75 animate-in fade-in duration-500">
      {/* max-w-5xl で読みやすい横幅に制限し、モバイルでも中央にまとまるレイアウトにしています。 */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-10 animate-in slide-in-from-bottom-2 duration-700">
        {/* タイトルを常に中央に配置します。 */}
        <div className="flex flex-col items-center gap-1">
          <AppHeader
            title="LifeHub"
            centerIcon={
              // アイコンを円形バッジに入れることで「アプリのシンボル」として視認しやすくします。
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-[0.5px] border-gold bg-navy-gradient shadow-sm sm:h-14 sm:w-14">
                <Sparkles className="h-7 w-7 text-gold sm:h-8 sm:w-8" />
              </span>
            }
          />

          <p className="text-center text-lg font-medium tracking-[0.35em] text-navy/80 sm:text-xl">PORTAL</p>
        </div>

        <div className="relative rounded-3xl border-[0.5px] border-gold bg-navy/80 p-5 text-gold backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-2 duration-700 [-webkit-touch-callout:none] sm:p-6">
          {/* タイトル: 常に中央に配置 */}
          <Link
            to="/event-countdown"
            className="flex items-center justify-center gap-2 text-center touch-manipulation select-none transition hover:brightness-110"
            aria-label="イベントカウントダウンページへ移動"
          >
            <CalendarClock className="h-5 w-5 text-gold sm:h-6 sm:w-6" />
            <h2 className="text-lg font-semibold tracking-[0.06em] text-white sm:text-xl">Event Countdown</h2>
          </Link>
          
          {/* イベントデータ更新ボタン: 右上に絶対配置 */}
          <Button
            variant="outline"
            size="sm"
            className="absolute right-5 top-5 border-gold/50 bg-transparent text-gold hover:bg-gold/10 hover:text-gold disabled:opacity-50"
            onClick={refreshEventItems}
            aria-label="イベントデータを再読み込み"
            title="イベントデータを再読み込み"
          >
            <RefreshCw className={cn('h-4 w-4')} />
          </Button>

          <div className="mt-3 rounded-2xl border-[0.5px] border-gold/45 bg-charcoal/40 px-4 py-4 text-center">
            {!highlightedEvent && (
              <p className="text-sm text-gold/90">楽しみなイベントを登録すると、ここに残り日数を表示します。</p>
            )}

            {highlightedEvent && (
              <p className="text-base font-semibold tracking-[0.02em] text-gold sm:text-lg">
                {highlightedEvent.daysUntil === 0
                  ? `${highlightedEvent.title} 当日！！`
                  : `${highlightedEvent.title} まであと${highlightedEvent.daysUntil}日！`}
              </p>
            )}
          </div>
        </div>

        <section className="rounded-3xl border-[0.5px] border-gold bg-navy/80 p-5 text-gold backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-2 duration-700 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-left">
              <CloudSun className="h-5 w-5 text-gold sm:h-6 sm:w-6" />
              <h2 className="text-lg font-semibold tracking-[0.06em] text-white sm:text-xl">Weather</h2>
            </div>

            <div className="flex items-center gap-2">
              {/* 天気データ更新ボタン */}
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 border-gold/50 bg-transparent text-gold hover:bg-gold/10 hover:text-gold disabled:opacity-50"
                onClick={retryLoadWeather}
                disabled={isLoading}
                aria-label="天気データを再読み込み"
                title="天気データを再読み込み"
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              </Button>

              {/* ラベル文字を省略し、タイトル行の右端にプルダウンだけを配置します。 */}
              <select
                aria-label="天気の地点選択"
                className="max-w-[104px] rounded-md border border-gold/70 bg-charcoal/60 px-2.5 py-1.5 text-xs text-white outline-none focus:border-gold sm:max-w-none sm:text-sm"
                value={selectedLocation}
                onChange={handleLocationChange}
              >
                {WEATHER_LOCATION_OPTIONS.map((locationOption) => (
                  <option key={locationOption.key} value={locationOption.key}>
                    {locationOption.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 7日分は常に横スライダー表示にして、狭い画面でも情報密度を落とさない構造にしています。 */}
          <div className="mt-4 flex justify-start gap-2 overflow-x-auto pb-2">
            {isLoading && (
              <p className="w-full py-6 text-center text-sm text-white/80">天気データを取得しています...</p>
            )}

            {!isLoading && errorMessage && (
              <div className="flex w-full min-w-[260px] flex-col items-center gap-3 rounded-2xl border-[0.5px] border-gold/50 bg-charcoal/40 p-4">
                <p className="text-center text-sm text-white">{errorMessage}</p>
                <Button
                  variant="outline"
                  className="border-gold bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
                  onClick={retryLoadWeather}
                >
                  再試行
                </Button>
              </div>
            )}

            {!isLoading && !errorMessage &&
              weatherDays.map((weatherDay, weatherIndex) => {
                const laundryImage = LAUNDRY_IMAGE_BY_LEVEL[weatherDay.laundry.level]

                return (
                  <article
                    key={weatherDay.date}
                    className={cn(
                      'flex min-h-[136px] min-w-[122px] flex-shrink-0 flex-col rounded-2xl border-[0.5px] bg-charcoal/50 p-2.5 text-center animate-in fade-in-0 zoom-in-95 duration-500',
                      weatherDay.isToday ? 'border-gold' : 'border-gold/35'
                    )}
                    style={{ animationDelay: `${weatherIndex * 70}ms` }}
                  >
                    <p className={cn('text-xs', weatherDay.isToday ? 'text-gold' : 'text-gold/85')}>{weatherDay.dateLabel}</p>
                    <p className="mt-1 text-xl text-white">{weatherDay.weatherEmoji}</p>
                    <p className="text-[11px] text-white/90">{weatherDay.weatherLabel}</p>
                    <p className="mt-1.5 text-xs text-gold/90">
                      {weatherDay.maxTemperature}° / {weatherDay.minTemperature}°
                    </p>
                    <p className="mt-1 text-[10px] text-white/80">湿度 {weatherDay.humidity}% / 風速 {weatherDay.windSpeed}m/s</p>
                    <p className="mt-0.5 text-[10px] text-white/80">降水確率 {weatherDay.precipitationProbability}%</p>

                    {/* 洗濯判定アイコンと注意文を表示 */}
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <img 
                        src={laundryImage} 
                        alt={`洗濯判定: ${weatherDay.laundry.level}`}
                        className="h-12 w-12 object-contain"
                      />
                      {weatherDay.laundry.caution && (
                        <p className="text-[9px] font-medium text-white/90">
                          {weatherDay.laundry.caution}
                        </p>
                      )}
                    </div>
                  </article>
                )
              })}
          </div>
        </section>

        {/* map でカードを描画すると、今後機能が増えても配列を1件追加するだけでUIを拡張できます。 */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {PORTAL_FEATURES.map((feature, featureIndex) => (
            <Link
              key={feature.title}
              to={feature.to}
              className="group relative min-h-[132px] touch-manipulation select-none overflow-hidden rounded-2xl border-[0.5px] border-gold bg-pearl/95 p-4 text-charcoal shadow-[0_8px_24px_rgba(27,38,59,0.15)] backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-2 transition duration-300 hover:scale-[1.02] hover:brightness-105 active:[transform:perspective(900px)_rotateY(-8deg)_scale(0.98)] [-webkit-touch-callout:none] sm:p-5"
              style={{ animationDelay: `${featureIndex * 90}ms` }}
            >
              {/* 背景模様: 目次ノートの罫線・マージン線・綴じ穴を抽象化し、生活ログの蓄積感を表現します。 */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-6 top-3 h-[calc(100%-24px)] w-px bg-gold/40" />
                <div className="absolute inset-x-3 top-8 h-px bg-gold/30" />
                <div className="absolute inset-x-3 top-[52px] h-px bg-gold/20" />
                <div className="absolute inset-x-3 top-[76px] h-px bg-gold/20" />
                <div className="absolute inset-x-3 top-[100px] h-px bg-gold/20" />

                <div className="absolute left-1.5 top-7 h-2 w-2 rounded-full border border-gold/40 bg-pearl" />
                <div className="absolute left-1.5 top-[54px] h-2 w-2 rounded-full border border-gold/40 bg-pearl" />
                <div className="absolute left-1.5 top-[81px] h-2 w-2 rounded-full border border-gold/40 bg-pearl" />
              </div>

              {/* 右半分のレイヤーを「表紙」に見立て、hover/activeで回転させて開く動きを作ります。 */}
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[46%] origin-left border-l border-gold/25 bg-gradient-to-l from-navy/20 to-transparent transition-transform duration-300 group-hover:[transform:perspective(900px)_rotateY(-16deg)] group-active:[transform:perspective(900px)_rotateY(-42deg)]" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium tracking-[0.16em] text-charcoal/75">CONTENTS {String(featureIndex + 1).padStart(2, '0')}</p>
                  <feature.icon className="h-6 w-6 text-navy sm:h-7 sm:w-7" />
                </div>

                <h2 className="pl-6 text-left text-sm font-semibold leading-snug text-charcoal sm:text-base">{feature.title}</h2>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
