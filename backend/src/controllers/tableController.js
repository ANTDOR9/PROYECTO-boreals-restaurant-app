const Table = require('../models/Table');

const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTable = async (req, res) => {
  try {
    const table = new Table(req.body);
    const saved = await table.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTableStatus = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!table) return res.status(404).json({ message: 'Mesa no encontrada' });
    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getTables, createTable, updateTableStatus };