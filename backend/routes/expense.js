const express = require('express');
const router = express.Router();
const pool = require('../database');

// Get all expense records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expense ORDER BY date DESC, created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense records'
    });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM expense WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Expense record not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching expense by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense record'
    });
  }
});

// Create new expense record
router.post('/', async (req, res) => {
  try {
    const {
      name,
      date,
      amount,
      expense_tag,
      spent_person,
      payment_type
    } = req.body;

    // Validation
    if (!name || !date || !amount || !expense_tag || !spent_person || !payment_type) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO expense (name, date, amount, expense_tag, spent_person, payment_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, date, amount, expense_tag, spent_person, payment_type]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Expense record created successfully'
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create expense record'
    });
  }
});

// Update expense record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      date,
      amount,
      expense_tag,
      spent_person,
      payment_type
    } = req.body;

    const result = await pool.query(
      `UPDATE expense 
       SET name = $1, date = $2, amount = $3, expense_tag = $4, 
           spent_person = $5, payment_type = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [name, date, amount, expense_tag, spent_person, payment_type, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Expense record not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Expense record updated successfully'
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update expense record'
    });
  }
});

// Delete expense record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM expense WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Expense record not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete expense record'
    });
  }
});

// Get expense summary/stats
router.get('/stats/summary', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM expense');
    const countResult = await pool.query('SELECT COUNT(*) as count FROM expense');
    const tagResult = await pool.query(`
      SELECT expense_tag, COUNT(*) as count, SUM(amount) as total
      FROM expense 
      GROUP BY expense_tag 
      ORDER BY total DESC
    `);

    res.json({
      success: true,
      data: {
        totalExpense: parseFloat(totalResult.rows[0].total),
        totalRecords: parseInt(countResult.rows[0].count),
        byTag: tagResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching expense stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense statistics'
    });
  }
});

// Get expenses by tag
router.get('/tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const result = await pool.query(
      'SELECT * FROM expense WHERE expense_tag = $1 ORDER BY date DESC',
      [tag]
    );
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching expenses by tag:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expenses by tag'
    });
  }
});

// Get monthly expense summary
router.get('/stats/monthly', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE_TRUNC('month', date) as month,
        SUM(amount) as total,
        COUNT(*) as count
      FROM expense 
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month DESC
      LIMIT 12
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching monthly expense stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly expense statistics'
    });
  }
});

module.exports = router;