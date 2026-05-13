import { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'text-yellow-400' },
  preparing: { label: 'Preparando', color: 'text-blue-400' },
  ready: { label: 'Listo', color: 'text-green-400' }
};

const emptyForm = { name: '', description: '', price: '', category: 'plato principal' };

function AdminPage() {
  const { orders } = useOrders();
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  const fetchMenu = () => getMenu().then(res => setMenu(res.data));

  useEffect(() => { fetchMenu(); }, []);

  const totalVentas = orders.filter(o => o.status === 'ready').reduce((sum, o) => sum + o.total, 0).toFixed(2);
  const totalPedidos = orders.length;
  const pedidosListos = orders.filter(o => o.status === 'ready').length;
  const pedidosPendientes = orders.filter(o => o.status === 'pending').length;

  const handleSubmit = async () => {
    if (!form.name || !form.price) return;
    if (editingId) {
      await updateMenuItem(editingId, form);
    } else {
      await createMenuItem(form);
    }
    setForm(emptyForm);
    setEditingId(null);
    fetchMenu();
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category });
    setEditingId(item._id);
    setActiveTab('menu');
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este producto?')) {
      await deleteMenuItem(id);
      fetchMenu();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">📊 Panel Administrador</h1>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Ventas</p>
          <p className="text-yellow-400 text-2xl font-bold">S/ {totalVentas}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Pedidos</p>
          <p className="text-white text-2xl font-bold">{totalPedidos}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Listos</p>
          <p className="text-green-400 text-2xl font-bold">{pedidosListos}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Pendientes</p>
          <p className="text-yellow-400 text-2xl font-bold">{pedidosPendientes}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'orders' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
          📋 Pedidos
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'menu' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
          🍽️ Gestionar Menú
        </button>
      </div>

      {/* Tab Pedidos */}
      {activeTab === 'orders' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Historial de Pedidos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">Mesa</th>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">Mesero</th>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">Items</th>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">Total</th>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">Estado</th>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map(order => {
                  const config = statusConfig[order.status];
                  return (
                    <tr key={order._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-white font-bold">Mesa {order.table}</td>
                      <td className="px-4 py-3 text-gray-300">{order.waiter}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
                      <td className="px-4 py-3 text-yellow-400 font-semibold">S/ {order.total}</td>
                      <td className={`px-4 py-3 font-semibold ${config.color}`}>{config.label}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleTimeString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Menú */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Formulario */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingId ? '✏️ Editar Producto' : '➕ Agregar Producto'}
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="text"
                placeholder="Descripción"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="number"
                placeholder="Precio (S/)"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="entrada">Entrada</option>
                <option value="plato principal">Plato principal</option>
                <option value="bebida">Bebida</option>
                <option value="postre">Postre</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 rounded-lg transition-colors"
                >
                  {editingId ? 'Guardar cambios' : 'Agregar'}
                </button>
                {editingId && (
                  <button
                    onClick={() => { setForm(emptyForm); setEditingId(null); }}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">📋 Productos actuales</h2>
            <div className="space-y-2">
              {menu.map(item => (
                <div key={item._id} className="flex justify-between items-center bg-gray-700 px-3 py-3 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.category} — S/ {item.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;