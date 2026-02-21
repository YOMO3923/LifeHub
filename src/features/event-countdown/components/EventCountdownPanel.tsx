import { CalendarClock, Gift, Music, PartyPopper, Plane, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ConfirmModal } from '@/components/common/ConfirmModal'
import { Button } from '@/components/ui'
import { useEventCountdown } from '@/features/event-countdown/hooks/useEventCountdown'
import type {
  EventCountdownDraft,
  EventCountdownItem,
  EventIconKey,
  UpcomingEventCountdownItem,
} from '@/features/event-countdown/types/eventCountdown'

type EventIconOption = {
  icon: React.ComponentType<{ className?: string }>
  key: EventIconKey
  label: string
}

const EVENT_ICON_OPTIONS: EventIconOption[] = [
  {
    key: 'sparkles',
    label: 'きらきら',
    icon: Sparkles,
  },
  {
    key: 'fireworks',
    label: '花火',
    icon: PartyPopper,
  },
  {
    key: 'gift',
    label: 'プレゼント',
    icon: Gift,
  },
  {
    key: 'plane',
    label: '旅行',
    icon: Plane,
  },
  {
    key: 'music',
    label: '音楽',
    icon: Music,
  },
]

const DEFAULT_DRAFT: EventCountdownDraft = {
  title: '',
  date: '',
  iconKey: 'sparkles',
}

const formatEventDate = (dateString: string) => {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${dateString}T00:00:00`))
}

const getEventIconComponent = (iconKey: EventIconKey) => {
  return EVENT_ICON_OPTIONS.find((iconOption) => iconOption.key === iconKey)?.icon ?? Sparkles
}

const getCountdownLabel = (eventItem: UpcomingEventCountdownItem) => {
  if (eventItem.daysUntil === 0) {
    return `${eventItem.title} 当日！！`
  }

  return `${eventItem.title} まであと${eventItem.daysUntil}日！`
}

export const EventCountdownPanel = () => {
  const {
    highlightedEvent,
    eventItems,
    upcomingEventItems,
    isLoading,
    isSubmitting,
    errorMessage,
    loadEventItems,
    createEventItem,
    updateEventItem,
    deleteEventItem,
  } = useEventCountdown()

  const [draft, setDraft] = useState<EventCountdownDraft>(DEFAULT_DRAFT)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [deleteTargetItem, setDeleteTargetItem] = useState<EventCountdownItem | null>(null)

  const highlightedIcon = useMemo(() => {
    if (!highlightedEvent) {
      return Sparkles
    }

    return getEventIconComponent(highlightedEvent.iconKey)
  }, [highlightedEvent])

  const handleChangeDraft = (key: keyof EventCountdownDraft, value: string) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!editingEventId) {
      const isCreated = await createEventItem({
        title: draft.title,
        date: draft.date,
        iconKey: draft.iconKey,
      })

      if (!isCreated) {
        return
      }

      setDraft(DEFAULT_DRAFT)
      return
    }

    const isUpdated = await updateEventItem(editingEventId, {
      title: draft.title,
      date: draft.date,
      iconKey: draft.iconKey,
    })

    if (!isUpdated) {
      return
    }

    setDraft(DEFAULT_DRAFT)
    setEditingEventId(null)
  }

  const handleStartEditing = (eventItem: EventCountdownItem) => {
    setDraft({
      title: eventItem.title,
      date: eventItem.date,
      iconKey: eventItem.iconKey,
    })
    setEditingEventId(eventItem.id)
  }

  const handleCancelEditing = () => {
    setEditingEventId(null)
    setDraft(DEFAULT_DRAFT)
  }

  const handleOpenDeleteModal = (eventItem: EventCountdownItem) => {
    setDeleteTargetItem(eventItem)
  }

  const handleCloseDeleteModal = () => {
    setDeleteTargetItem(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTargetItem) {
      return
    }

    const isDeleted = await deleteEventItem(deleteTargetItem.id)

    if (!isDeleted) {
      return
    }

    if (editingEventId === deleteTargetItem.id) {
      handleCancelEditing()
    }

    handleCloseDeleteModal()
  }

  const HighlightedIcon = highlightedIcon

  return (
    <section className="rounded-3xl border-[0.5px] border-gold bg-navy/80 p-5 text-white backdrop-blur-md animate-in fade-in-0 slide-in-from-bottom-2 duration-700 sm:p-6">
      <div className="flex items-center justify-center gap-2 text-center">
        <CalendarClock className="h-5 w-5 text-gold sm:h-6 sm:w-6" />
        <h2 className="text-lg font-semibold tracking-[0.06em] text-white sm:text-xl">Event Countdown</h2>
      </div>

      <article className="mt-4 rounded-2xl border-[0.5px] border-gold bg-charcoal/45 p-4 sm:p-5">
        {!highlightedEvent && (
          <div className="flex min-h-[108px] flex-col items-center justify-center gap-2 text-center">
            <Sparkles className="h-8 w-8 text-gold" />
            <p className="text-sm text-gold/90">楽しみなイベントを登録すると、ここに最短カウントダウンを大きく表示します。</p>
          </div>
        )}

        {highlightedEvent && (
          <div className="flex min-h-[108px] flex-col items-center justify-center gap-2 text-center animate-in fade-in-0 zoom-in-95 duration-500">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-[0.5px] border-gold bg-navy-gradient">
              <HighlightedIcon className="h-7 w-7 text-gold" />
            </span>
            <p className="text-xs text-gold/90">次に楽しみなイベント</p>
            {highlightedEvent.daysUntil !== 0 && (
              <p className="text-2xl font-semibold tracking-[0.02em] text-white sm:text-3xl">{highlightedEvent.title}</p>
            )}
            <p className="text-xs text-white/80">{formatEventDate(highlightedEvent.date)}</p>
            <p className="text-base font-semibold text-gold sm:text-lg">{getCountdownLabel(highlightedEvent)}</p>
          </div>
        )}
      </article>

      {/* 入力フォームは1列グリッドで「イベント名 → 日程 → アイコン」を順に案内し、迷わず登録できる流れにします。 */}
      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <label className="grid gap-1.5">
          <span className="text-xs text-gold/90">イベント名</span>
          <input
            className="rounded-md border border-gold/70 bg-charcoal/60 px-3 py-2 text-base text-white outline-none placeholder:text-white/50 focus:border-gold sm:text-sm"
            type="text"
            placeholder="例: 北海道旅行"
            value={draft.title}
            onChange={(event) => handleChangeDraft('title', event.target.value)}
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-xs text-gold/90">日程</span>
            <input
              className="rounded-md border border-gold/70 bg-charcoal/60 px-3 py-2 text-base text-white outline-none focus:border-gold sm:text-sm"
              type="date"
              value={draft.date}
              onChange={(event) => handleChangeDraft('date', event.target.value)}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs text-gold/90">アイコン</span>
            <select
              className="rounded-md border border-gold/70 bg-charcoal/60 px-3 py-2 text-base text-white outline-none focus:border-gold sm:text-sm"
              value={draft.iconKey}
              onChange={(event) => handleChangeDraft('iconKey', event.target.value)}
            >
              {EVENT_ICON_OPTIONS.map((iconOption) => (
                <option key={iconOption.key} value={iconOption.key}>
                  {iconOption.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {errorMessage && <p className="text-sm text-white/90">{errorMessage}</p>}

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <Button
            type="submit"
            className="w-full bg-gold text-navy hover:bg-gold/90 sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? '保存中...' : editingEventId ? 'イベントを更新' : 'イベントを追加'}
          </Button>

          {editingEventId && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-gold bg-transparent text-gold hover:bg-gold/10 hover:text-gold sm:w-auto"
              onClick={handleCancelEditing}
              disabled={isSubmitting}
            >
              編集をキャンセル
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full border-gold bg-transparent text-gold hover:bg-gold/10 hover:text-gold sm:w-auto"
            onClick={loadEventItems}
            disabled={isLoading}
          >
            {isLoading ? '更新中...' : '再読み込み'}
          </Button>
        </div>
      </form>

      <div className="mt-4 grid gap-2">
        {upcomingEventItems.length === 0 && (
          <p className="text-sm text-gold/90">登録済みのイベントはありません。</p>
        )}

        {upcomingEventItems.map((eventItem) => {
          const EventIcon = getEventIconComponent(eventItem.iconKey)
          const isEditingTarget = editingEventId === eventItem.id

          return (
            <article
              key={eventItem.id}
              className="rounded-xl border-[0.5px] border-gold/40 bg-charcoal/35 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <EventIcon className="h-4 w-4 text-gold" />
                  <div>
                    <p className="text-sm text-white">{eventItem.title}</p>
                    <p className="text-[11px] text-white/70">{formatEventDate(eventItem.date)}</p>
                  </div>
                </div>

                <p className="text-xs font-semibold text-gold">
                  {eventItem.daysUntil === 0 ? '当日！！' : `あと${eventItem.daysUntil}日`}
                </p>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gold bg-transparent px-2 py-1 text-xs text-gold hover:bg-gold/10 hover:text-gold"
                  onClick={() => handleStartEditing(eventItem)}
                  disabled={isSubmitting}
                >
                  {isEditingTarget ? '編集中' : '編集'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gold bg-transparent px-2 py-1 text-xs text-gold hover:bg-gold/10 hover:text-gold"
                  onClick={() => handleOpenDeleteModal(eventItem)}
                  disabled={isSubmitting}
                >
                  削除
                </Button>
              </div>
            </article>
          )
        })}
      </div>

      {/* 過去日イベントはカウントダウン対象外ですが、編集ページで存在を把握しやすいよう件数を補助表示します。 */}
      <p className="mt-2 text-[11px] text-white/70">全登録件数: {eventItems.length} 件</p>

      <ConfirmModal
        isOpen={Boolean(deleteTargetItem)}
        isProcessing={isSubmitting}
        title="イベントを削除しますか？"
        description={deleteTargetItem ? `「${deleteTargetItem.title}」を削除します。この操作は取り消せません。` : ''}
        confirmLabel="削除する"
        cancelLabel="キャンセル"
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteModal}
      />
    </section>
  )
}
