import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import WaiterPage from './pages/WaiterPage'
import KitchenPage from './pages/KitchenPage'
import AdminPage from './pages/AdminPage'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = () => window.location.href;

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6 items-center">
        <span className="text-yellow-400 font-bold text-lg">🍽️ Boreals</span>
        {user?.role === 'waiter' || user?.role === 'admin' ? (
          <a href="/" className="text-gray-300 hover:text-white">Mesero</a>
        ) : null}
        {user?.role === 'kitchen' || user?.role === 'admin' ? (
          <a href="/kitchen" className="text-gray-300 hover:text-white">Cocina</a>
        ) : null}
        {user?.role === 'admin' ? (
          <a href="/admin" className="text-gray-300 hover:text-white">Admin</a>
        ) : null}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">👤 {user?.username}</span>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={
          <ProtectedRoute roles={['waiter', 'admin']}>
            <WaiterPage />
          </ProtectedRoute>
        } />
        <Route path="/kitchen" element={
          <ProtectedRoute roles={['kitchen', 'admin']}>
            <KitchenPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;