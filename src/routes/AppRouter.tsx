import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home-page/HomePage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'

// ルーティング定義を routes 配下へ分離し、main.tsx からは App だけを読む構成にします。
export const appRouter = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      // どのルートにも一致しない場合は 404 画面を表示します。
      path: '*',
      element: <NotFoundPage />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  }
)
