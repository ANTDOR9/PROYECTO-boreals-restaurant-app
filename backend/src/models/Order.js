const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  table: { type: Number, required: true },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready'],
    default: 'pending'
  },
  total: { type: Number, required: true },
  waiter: { type: String, required: true },
  notes: { type: String, default: '' }
}, {
  timestamps: true  // agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Order', orderSchema);