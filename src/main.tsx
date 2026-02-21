import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* アプリ全体の入口。ルーティング定義は App.tsx 側で注入します。 */}
    <App />
  </StrictMode>
)
