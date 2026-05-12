const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  updateTableStatus
} = require('../controllers/tableController');

router.get('/', getTables);
router.post('/', createTable);
router.put('/:id', updateTableStatus);

module.exports = router;