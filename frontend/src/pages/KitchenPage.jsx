import { useOrders } from '../context/OrderContext';
import { updateOrderStatus } from '../services/api';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-500', next: 'preparing', nextLabel: 'Iniciar preparación' },
  preparing: { label: 'Preparando', color: 'bg-blue-500', next: 'ready', nextLabel: 'Marcar como listo' },
  ready: { label: 'Listo', color: 'bg-green-500', next: null, nextLabel: null }
};

function KitchenPage() {
  const { orders, fetchOrders } = useOrders();

  const handleStatusChange = async (id, nextStatus) => {
    await updateOrderStatus(id, nextStatus);
    fetchOrders();
  };

  const activeOrders = orders.filter(o => o.status !== 'ready');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">👨‍🍳 Pantalla de Cocina</h1>

      {activeOrders.length === 0 && (
        <div className="text-center text-gray-500 mt-20 text-xl">
          No hay pedidos activos
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeOrders.map(order => {
          const config = statusConfig[order.status];
          return (
            <div key={order._id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">

              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Mesa {order.table}</h2>
                <span className={`${config.color} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                  {config.label}
                </span>
              </div>

              {/* Mesero */}
              <p className="text-gray-400 text-sm mb-3">👤 Mesero: {order.waiter}</p>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-yellow-400 font-semibold">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Notas */}
              {order.notes && (
                <p className="text-orange-400 text-sm mb-4">📝 {order.notes}</p>
              )}

              {/* Botón cambiar estado */}
              {config.next && (
                <button
                  onClick={() => handleStatusChange(order._id, config.next)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  {config.nextLabel}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default KitchenPage;