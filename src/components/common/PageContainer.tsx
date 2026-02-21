import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}

export const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">{children}</div>
    </div>
  )
}
