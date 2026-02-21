import { PageContainer } from '@/components/common/PageContainer'
import { CounterCard } from '@/features/counter'

export const HomePage = () => {
  return (
    <PageContainer>
      <section className="w-full rounded-3xl border border-slate-800/70 bg-slate-900/70 p-10 shadow-2xl backdrop-blur">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-sm font-semibold text-cyan-200">
          Tailwind CSS Ready
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Vite + React + TypeScript
        </h1>
        <p className="mt-3 text-lg text-slate-300">機能ごとに分割したテンプレート構成です。</p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <CounterCard />
          <aside className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Next</p>
            <h2 className="mt-3 text-xl font-semibold text-white">次のステップ</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                `features` 配下に機能を追加
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                `components/common` で画面共通部品を管理
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                `pages` は機能を組み合わせるだけにする
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </PageContainer>
  )
}
