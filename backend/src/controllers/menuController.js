const Menu = require('../models/Menu');

const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find({ available: true });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const item = new Menu(req.body);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const item = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMenu, createMenuItem, updateMenuItem, deleteMenuItem };