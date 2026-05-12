import { Routes, Route } from 'react-router-dom'
import WaiterPage from './pages/WaiterPage'
import KitchenPage from './pages/KitchenPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex gap-6">
        <a href="/" className="text-yellow-400 font-bold text-lg">🍽️ Boreals</a>
        <a href="/" className="text-gray-300 hover:text-white">Mesero</a>
        <a href="/kitchen" className="text-gray-300 hover:text-white">Cocina</a>
        <a href="/admin" className="text-gray-300 hover:text-white">Admin</a>
      </nav>

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<WaiterPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App