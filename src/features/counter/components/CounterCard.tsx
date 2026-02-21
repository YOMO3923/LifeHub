import { useCounter } from '@/features/counter/hooks/useCounter'

export const CounterCard = () => {
  const { value, increment } = useCounter()

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Counter</p>
      <div className="mt-3 flex items-end gap-4">
        <span className="text-5xl font-bold text-white">{value}</span>
        <span className="text-sm text-slate-400">クリック回数</span>
      </div>
      <button
        type="button"
        onClick={increment}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
      >
        カウントを増やす
      </button>
    </article>
  )
}
