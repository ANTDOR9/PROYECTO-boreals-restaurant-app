import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password
      });

      login(res.data);

      // Redirigir según rol
      if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'kitchen') navigate('/kitchen');
      else navigate('/');

    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2">🍽️</h1>
          <h2 className="text-2xl font-bold text-white">Boreals Restaurant</h2>
          <p className="text-gray-400 text-sm mt-1">Sistema de gestión</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Tu usuario"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 text-gray-900 font-bold py-3 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>

        {/* Roles de prueba */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <p className="text-gray-500 text-xs text-center mb-2">Usuarios de prueba</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-gray-700 rounded-lg p-2">
              <p className="text-yellow-400 font-bold">Admin</p>
              <p className="text-gray-400">admin</p>
              <p className="text-gray-400">admin123</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-2">
              <p className="text-blue-400 font-bold">Mesero</p>
              <p className="text-gray-400">mesero1</p>
              <p className="text-gray-400">mesero123</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-2">
              <p className="text-green-400 font-bold">Cocina</p>
              <p className="text-gray-400">cocina1</p>
              <p className="text-gray-400">cocina123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;