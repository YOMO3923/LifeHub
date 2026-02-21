import { Button } from '@/components/ui'

type ConfirmModalProps = {
  isOpen: boolean
  isProcessing?: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

const DEFAULT_CONFIRM_LABEL = '削除する'
const DEFAULT_CANCEL_LABEL = 'キャンセル'

export const ConfirmModal = ({
  isOpen,
  isProcessing = false,
  title,
  description,
  confirmLabel = DEFAULT_CONFIRM_LABEL,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  if (!isOpen) {
    return null
  }

  return (
    // モーダル全体を fixed で画面に重ね、z-index を高くして必ず前面に表示します。
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-md rounded-2xl border-[0.5px] border-gold bg-charcoal p-5 text-white shadow-xl">
        <h2 className="text-base font-semibold text-gold sm:text-lg">{title}</h2>
        <p className="mt-2 text-sm text-white/85">{description}</p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full border-gold bg-transparent text-gold hover:bg-gold/10 hover:text-gold sm:w-auto"
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className="w-full bg-gold text-navy hover:bg-gold/90 sm:w-auto"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? '処理中...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
