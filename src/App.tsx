import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MachinePage from './pages/MachinePage'
import QRCodesPage from './pages/QRCodesPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/machine/:id" element={<MachinePage />} />
      <Route path="/admin/qr-codes" element={<QRCodesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
