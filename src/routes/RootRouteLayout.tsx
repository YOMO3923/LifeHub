import { Outlet } from 'react-router-dom'
import { ScrollToTopOnRouteChange } from '@/components/common/ScrollToTopOnRouteChange'

export const RootRouteLayout = () => {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <Outlet />
    </>
  )
}
