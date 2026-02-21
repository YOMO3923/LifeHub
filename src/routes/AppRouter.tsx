import { createBrowserRouter, createHashRouter } from 'react-router-dom'
import { CookingSupportPage } from '@/pages/cooking-support-page/CookingSupportPage'
import { EventCountdownPage } from '@/pages/event-countdown-page/EventCountdownPage'
import { HouseworkTaskPage } from '@/pages/housework-task-page/HouseworkTaskPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { OneLineDiaryPage } from '@/pages/one-line-diary-page/OneLineDiaryPage'
import { PortalPage } from '@/pages/portal-page/PortalPage'
import { PreTravelPage } from '@/pages/pre-travel-page/PreTravelPage'
import { RootRouteLayout } from '@/routes/RootRouteLayout'

// ルーティング定義を routes 配下へ分離し、main.tsx からは App だけを読む構成にします。
const createRouter = import.meta.env.PROD ? createHashRouter : createBrowserRouter

export const appRouter = createRouter(
  [
    {
      path: '/',
      element: <RootRouteLayout />,
      children: [
        {
          // ポータル画面。アプリ起点なのでトップパスに割り当てます。
          index: true,
          element: <PortalPage />,
        },
        {
          // 各機能は個別URLを持たせることで、将来的にブックマークや直リンクにも対応しやすくします。
          path: 'one-line-diary',
          element: <OneLineDiaryPage />,
        },
        {
          path: 'housework-task',
          element: <HouseworkTaskPage />,
        },
        {
          path: 'pre-travel',
          element: <PreTravelPage />,
        },
        {
          path: 'cooking-support',
          element: <CookingSupportPage />,
        },
        {
          path: 'event-countdown',
          element: <EventCountdownPage />,
        },
        {
          // どのルートにも一致しない場合は 404 画面を表示します。
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    future: {
      // React Router v7 への移行を見据えた future フラグです。
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  }
)
