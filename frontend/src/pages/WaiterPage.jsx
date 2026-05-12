import { useState, useEffect } from 'react';
import { getMenu, getTables, createOrder } from '../services/api';

function WaiterPage() {
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [waiter, setWaiter] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getMenu().then(res => setMenu(res.data));
    getTables().then(res => setTables(res.data));

    // Refrescar mesas cada 5 segundos
    const interval = setInterval(() => {
      getTables().then(res => setTables(res.data));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addItem = (item) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i._id === item._id);
      if (exists) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setSelectedItems(prev => prev.filter(i => i._id !== id));
  };

  const getTotal = () => {
    return selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);
  };

const handleSubmit = async () => {
  if (!selectedTable || selectedItems.length === 0 || !waiter) return;

  await createOrder({
    table: selectedTable,
    waiter,
    notes,
    items: selectedItems.map(i => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity
    }))
  });

  // Refrescar mesas después de crear pedido
  getTables().then(res => setTables(res.data));

  setSelectedItems([]);
  setSelectedTable(null);
  setNotes('');
  setSuccess(true);
  setTimeout(() => setSuccess(false), 3000);
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">🧾 Crear Pedido</h1>

      {success && (
        <div className="bg-green-600 text-white px-4 py-3 rounded-lg mb-4 text-center font-semibold">
          ✅ Pedido enviado a cocina
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Columna izquierda — Mesa y Mesero */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">👤 Mesero</h2>
            <input
              type="text"
              placeholder="Tu nombre"
              value={waiter}
              onChange={e => setWaiter(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">🪑 Mesa</h2>
            <div className="grid grid-cols-3 gap-2">
              {tables.map(table => (
                <button
                  key={table._id}
                  onClick={() => table.status === 'available' && setSelectedTable(table.number)}
                  className={`py-3 rounded-lg font-bold transition-colors ${
                    selectedTable === table.number
                      ? 'bg-yellow-400 text-gray-900'
                      : table.status === 'occupied'
                      ? 'bg-red-800 text-red-300 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {table.number}
                  <span className="block text-xs font-normal">
                    {table.status === 'occupied' ? '🔴 ocupada' : '🟢 libre'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">📝 Notas</h2>
            <textarea
              placeholder="Sin cebolla, alergia a..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Columna central — Menú */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-3">🍽️ Menú</h2>
          <div className="space-y-2">
            {menu.map(item => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-gray-700 px-3 py-3 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400 text-sm">{item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-semibold">S/ {item.price}</span>
                  <button
                    onClick={() => addItem(item)}
                    className="bg-yellow-400 text-gray-900 font-bold w-8 h-8 rounded-full hover:bg-yellow-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha — Pedido */}
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-3">🛒 Pedido</h2>

          {selectedItems.length === 0 && (
            <p className="text-gray-500 text-sm">Agrega productos del menú</p>
          )}

          <div className="space-y-2 flex-1">
            {selectedItems.map(item => (
              <div key={item._id} className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded-lg">
                <div>
                  <p className="text-white text-sm">{item.name}</p>
                  <p className="text-gray-400 text-xs">x{item.quantity} — S/ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-400 hover:text-red-300 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="flex justify-between text-white font-bold mb-4">
                <span>Total</span>
                <span className="text-yellow-400">S/ {getTotal()}</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selectedTable || !waiter}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-lg transition-colors"
              >
                Enviar a Cocina
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaiterPage;