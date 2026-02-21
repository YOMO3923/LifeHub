import { RouterProvider } from 'react-router-dom'
import { appRouter } from '@/routes/AppRouter'

const App = () => {
  return (
    // App.tsx ではルーティングや全体 Provider をまとめて管理します。
    <RouterProvider router={appRouter} />
  )
}

export default App
