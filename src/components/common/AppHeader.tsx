import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

type AppHeaderProps = {
  title: string
  canGoBack?: boolean
  backLabel?: string
  backTo?: string
  centerIcon?: ReactNode
  titleClassName?: string
}

const DEFAULT_BACK_LABEL = 'ポータルに戻る'
const DEFAULT_BACK_TO = '/'

export const AppHeader = ({
  title,
  canGoBack = false,
  backLabel = DEFAULT_BACK_LABEL,
  backTo = DEFAULT_BACK_TO,
  centerIcon,
  titleClassName,
}: AppHeaderProps) => {
  return (
    // relative を親にすることで、戻るボタンを absolute で左固定しても、タイトル中央を崩さず配置できます。
    <header className="relative flex min-h-[72px] items-center justify-center">
      {/* 戻るボタンは左端に固定。top-1/2 + -translate-y-1/2 で縦方向の真ん中に正確に合わせます。 */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        {canGoBack ? (
          <Link
            to={backTo}
            aria-label={backLabel}
            // h/w を同値にした丸ボタンはタップ領域を確保しつつ、モバイルでも見た目を崩しにくいです。
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold text-navy transition hover:brightness-110"
          >
            <ChevronLeft className="h-4 w-4" />
            {/* 画面上はアイコンのみ表示しつつ、読み上げソフト向けには文言を残してアクセシビリティを確保します。 */}
            <span className="sr-only">{backLabel}</span>
          </Link>
        ) : null}
      </div>

      {/* px-12 は左の戻るボタンとタイトルが重ならないための余白です。 */}
      <div className="flex w-full items-center justify-center gap-2 px-12 sm:px-0">
        {centerIcon}
        <h1
          className={
            titleClassName ??
            // break-words と text-balance を併用し、長いタイトルでも自然に改行して読みやすさを維持します。
            'max-w-[70vw] whitespace-normal break-words text-balance text-center font-serif text-4xl font-semibold leading-tight tracking-[0.08em] text-navy sm:max-w-none sm:text-5xl'
          }
        >
          {title}
        </h1>
      </div>
    </header>
  )
}
