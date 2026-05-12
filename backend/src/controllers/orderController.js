const Order = require('../models/Order');
const Table = require('../models/Table');

// Obtener todos los pedidos
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear nuevo pedido
const createOrder = async (req, res) => {
  try {
    const { table, items, waiter, notes } = req.body;

    const total = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const order = new Order({ table, items, waiter, notes, total });
    const savedOrder = await order.save();

    // Marcar mesa como ocupada
    await Table.updateOne({ number: table }, { status: 'occupied' });

    req.io.emit('new_order', savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cambiar estado del pedido
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });

    // Si el pedido está listo, liberar la mesa
    if (status === 'ready') {
      await Table.updateOne({ number: order.table }, { status: 'available' });
    }

    req.io.emit('order_status_changed', order);
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar pedido
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrders, createOrder, updateOrderStatus, deleteOrder };