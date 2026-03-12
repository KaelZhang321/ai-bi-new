import React from 'react'
import { ConfigProvider } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { antdDarkTheme } from './styles/theme'
import Dashboard from './pages/Dashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider theme={antdDarkTheme}>
      <Dashboard />
    </ConfigProvider>
  </QueryClientProvider>
)

export default App
