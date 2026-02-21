import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/common/PageContainer'

// 404 ページで表示する固定文言を定数化し、マジックナンバーや直書きを避けます。
const NOT_FOUND_STATUS_CODE = '404'
const NOT_FOUND_TITLE = 'ページが見つかりません'
const NOT_FOUND_DESCRIPTION = 'URL が間違っているか、ページが移動された可能性があります。'

export const NotFoundPage = () => {
  return (
    <PageContainer>
      {/* 画面中央に 404 情報をまとめるカード領域です。 */}
      <section className="w-full rounded-3xl border border-slate-800/70 bg-slate-900/70 p-10 text-center shadow-2xl backdrop-blur">
        {/* 大きな数字で 404 状態だと即座に認識できるようにしています。 */}
        <p className="text-6xl font-black tracking-tight text-cyan-300 md:text-7xl">
          {NOT_FOUND_STATUS_CODE}
        </p>

        {/* ページの状態を説明するメイン見出しです。 */}
        <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">{NOT_FOUND_TITLE}</h1>

        {/* 補足説明を表示し、次の行動をユーザーが判断しやすくします。 */}
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 md:text-base">
          {NOT_FOUND_DESCRIPTION}
        </p>

        {/* Home への導線。rounded / bg / hover でボタンらしい見た目を作ります。 */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
        >
          ホームに戻る
        </Link>
      </section>
    </PageContainer>
  )
}
