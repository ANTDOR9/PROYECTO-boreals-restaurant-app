import { useOrders } from '../context/OrderContext';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'text-yellow-400' },
  preparing: { label: 'Preparando', color: 'text-blue-400' },
  ready: { label: 'Listo', color: 'text-green-400' }
};

function AdminPage() {
  const { orders } = useOrders();

  const totalVentas = orders
    .filter(o => o.status === 'ready')
    .reduce((sum, o) => sum + o.total, 0)
    .toFixed(2);

  const totalPedidos = orders.length;
  const pedidosListos = orders.filter(o => o.status === 'ready').length;
  const pedidosPendientes = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">📊 Panel Administrador</h1>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      {/* Tabla de pedidos */}
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
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-yellow-400 font-semibold">S/ {order.total}</td>
                    <td className={`px-4 py-3 font-semibold ${config.color}`}>{config.label}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;