import { BookOpenText, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from '@/components/ui'
import { useOneLineDiary } from '@/features/one-line-diary/hooks/useOneLineDiary'
import { WEEKDAY_LABELS } from '@/features/one-line-diary/utils/date'
import { cn } from '@/lib/utils'

const SELECTED_DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
})

export const OneLineDiaryPanel = () => {
  const {
    diaryMap,
    monthLabel,
    selectedDate,
    selectedDateKey,
    draftNote,
    isModalOpen,
    calendarCells,
    isLoading,
    isSaving,
    errorMessage,
    loadDiaryMap,
    openDiaryModal,
    closeDiaryModal,
    goPrevMonth,
    goNextMonth,
    handleChangeDraftNote,
    saveDiaryForSelectedDate,
  } = useOneLineDiary()

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) {
      return ''
    }

    return SELECTED_DATE_FORMATTER.format(selectedDate)
  }, [selectedDate])

  return (
    // セクション全体は機能カードの外枠です。rounded / border / bg でポータルと同じ世界観を維持します。
    <section className="rounded-3xl border-[0.5px] border-gold bg-navy/80 p-5 text-white backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-2 duration-700 sm:p-6">
      <div className="flex items-center justify-center gap-2 text-center">
        <BookOpenText className="h-5 w-5 text-gold sm:h-6 sm:w-6" />
        <h2 className="text-lg font-semibold tracking-[0.06em] text-white sm:text-xl">One-Line Diary</h2>
      </div>

      <p className="mt-2 text-center text-xs text-gold/90 sm:text-sm">日付を押すと一言日記を記録できます（未来日は選択できません）。</p>

      {/* 月移動ヘッダーは「いつのカレンダーか」を常に把握しやすくするためのUIです。 */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border-[0.5px] border-gold/50 bg-charcoal/45 px-3 py-2 sm:px-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-gold/60 bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
          onClick={goPrevMonth}
          aria-label="前月へ移動"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <p className="text-sm font-semibold text-white sm:text-base">{monthLabel}</p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-gold/60 bg-transparent text-gold hover:bg-gold/10 hover:text-gold"
          onClick={goNextMonth}
          aria-label="次月へ移動"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 曜日見出し。grid-cols-7 で「日〜土」を固定列にして、日付セルとの対応を明確にします。 */}
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-gold/85 sm:gap-1.5 sm:text-sm">
        {WEEKDAY_LABELS.map((weekdayLabel) => (
          <p key={weekdayLabel} className="py-1">
            {weekdayLabel}
          </p>
        ))}
      </div>

      {/* 日付グリッド本体。42セル固定なので月切替時も高さが変わらず、視線移動が少なくなります。 */}
      <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5">
        {calendarCells.map((calendarCell) => {
          const hasDiary = Boolean(diaryMap[calendarCell.dateKey])

          return (
            <button
              key={calendarCell.dateKey}
              type="button"
              className={cn(
                'relative min-h-12 rounded-lg border-[0.5px] px-1.5 py-1 text-sm transition sm:min-h-14 sm:text-base',
                // bg / border / text を日付状態で切り替え、どの日が押せるか直感的に分かる配色にします。
                calendarCell.isCurrentMonth ? 'border-gold/35 bg-charcoal/40 text-white' : 'border-gold/20 bg-charcoal/25 text-white/50',
                calendarCell.isFuture && 'cursor-not-allowed opacity-45',
                calendarCell.isToday && 'border-gold bg-charcoal/70 text-gold',
                selectedDateKey === calendarCell.dateKey && 'border-gold bg-gold/20 text-gold'
              )}
              disabled={calendarCell.isFuture}
              onClick={() => openDiaryModal(calendarCell.date)}
              aria-label={`${calendarCell.dateKey} の日記を編集`}
            >
              <span>{calendarCell.dayNumber}</span>

              {/* ドットは「保存済み日」を瞬時に見分ける視覚サインです。 */}
              {hasDiary && (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {errorMessage && <p className="text-sm text-white/90">{errorMessage}</p>}

        <Button
          type="button"
          variant="outline"
          className="border-gold/60 bg-transparent text-gold hover:bg-gold/10 hover:text-gold sm:ml-auto"
          onClick={loadDiaryMap}
          disabled={isLoading}
        >
          {isLoading ? '読み込み中...' : '再読み込み'}
        </Button>
      </div>

      {isModalOpen && selectedDate && (
        // fixed + inset-0 で画面全体に重ね、入力に集中できるモーダル層を作ります。
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="一言日記入力モーダル"
        >
          <div className="w-full max-w-md rounded-2xl border-[0.5px] border-gold bg-charcoal p-5 text-white shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gold/90">選択日</p>
                <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">{selectedDateLabel}</h3>
              </div>

              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gold/60 text-gold transition hover:bg-gold/10"
                onClick={closeDiaryModal}
                aria-label="モーダルを閉じる"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* textarea は複数行入力を許可しつつ、今回は一言用途なので高さを控えめにしています。 */}
            <label className="mt-4 grid gap-1.5">
              <span className="text-xs text-gold/90">一言日記</span>
              <textarea
                className="min-h-[112px] w-full resize-none rounded-md border border-gold/70 bg-charcoal/60 px-3 py-2 text-sm text-white outline-none placeholder:text-white/50 focus:border-gold"
                value={draftNote}
                onChange={(event) => handleChangeDraftNote(event.target.value)}
                placeholder="今日の出来事を一言で残しましょう"
              />
            </label>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gold bg-transparent text-gold hover:bg-gold/10 hover:text-gold sm:w-auto"
                onClick={closeDiaryModal}
                disabled={isSaving}
              >
                キャンセル
              </Button>
              <Button
                type="button"
                className="w-full bg-gold text-navy hover:bg-gold/90 sm:w-auto"
                onClick={() => {
                  void saveDiaryForSelectedDate()
                }}
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存する'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
