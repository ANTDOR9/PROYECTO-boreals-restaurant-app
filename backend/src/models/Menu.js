const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ['entrada', 'plato principal', 'bebida', 'postre'],
    required: true
  },
  available: { type: Boolean, default: true },
  image: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Menu', menuSchema);