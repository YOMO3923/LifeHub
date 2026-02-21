import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// サイズ定義を定数として分けることで、後から「どのサイズを採用しているか」を見つけやすくします。
const BUTTON_SIZE_CLASSES = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
} as const

// 見た目のバリエーション定義です。
// cva を使う理由は「variant と size を型安全に扱い、class 文字列の管理を一か所に寄せる」ためです。
const buttonVariants = cva(
  // inline-flex: 中のテキスト/アイコンを横並びに整列
  // rounded-md: 角を丸めてボタンらしい形に
  // transition-colors: hover 時の色変化を滑らかに
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: BUTTON_SIZE_CLASSES.default,
        sm: BUTTON_SIZE_CLASSES.sm,
        lg: BUTTON_SIZE_CLASSES.lg,
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export const Button = ({ className, variant, size, type = 'button', ...props }: ButtonProps) => {
  // type 未指定時の accidental submit を防ぐため、既定値を button にしています。
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
