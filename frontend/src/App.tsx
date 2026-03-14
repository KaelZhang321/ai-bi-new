import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { antdDarkTheme } from './styles/theme'
import Dashboard from './pages/Dashboard'
import MobileDashboard from './pages/mobile/MobileDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

const routerBase = import.meta.env.BASE_URL === '/'
  ? undefined
  : import.meta.env.BASE_URL.replace(/\/$/, '')

function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const narrowScreen = window.innerWidth < 768
  return mobileUA || narrowScreen
}

const HomeRoute: React.FC = () => {
  if (isMobile()) {
    return <Navigate to="/mobile" replace />
  }
  return <Dashboard />
}

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={antdDarkTheme}>
      <BrowserRouter basename={routerBase}>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/mobile" element={<MobileDashboard />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  </QueryClientProvider>
)

export default App
