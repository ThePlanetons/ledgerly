const express = require('express');
const router = express.Router();
const pool = require('../database');

// Get all income records
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM income ORDER BY settlement_date DESC, created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch income records'
    });
  }
});

// Get income by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM income WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Income record not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching income by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch income record'
    });
  }
});

// Create new income record
router.post('/', async (req, res) => {
  try {
    const {
      project_name,
      client_name,
      amount,
      settlement_date,
      settlement_phase,
      source_person,
      payment_type
    } = req.body;

    // Validation
    if (!project_name || !client_name || !amount || !settlement_date || !settlement_phase || !source_person || !payment_type) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const result = await pool.query(
      `INSERT INTO income (project_name, client_name, amount, settlement_date, settlement_phase, source_person, payment_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [project_name, client_name, amount, settlement_date, settlement_phase, source_person, payment_type]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Income record created successfully'
    });
  } catch (error) {
    console.error('Error creating income:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create income record'
    });
  }
});

// Update income record
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      project_name,
      client_name,
      amount,
      settlement_date,
      settlement_phase,
      source_person,
      payment_type
    } = req.body;

    const result = await pool.query(
      `UPDATE income 
       SET project_name = $1, client_name = $2, amount = $3, settlement_date = $4, 
           settlement_phase = $5, source_person = $6, payment_type = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [project_name, client_name, amount, settlement_date, settlement_phase, source_person, payment_type, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Income record not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Income record updated successfully'
    });
  } catch (error) {
    console.error('Error updating income:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update income record'
    });
  }
});

// Delete income record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM income WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Income record not found'
      });
    }

    res.json({
      success: true,
      message: 'Income record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete income record'
    });
  }
});

// Get income summary/stats
router.get('/stats/summary', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM income');
    const countResult = await pool.query('SELECT COUNT(*) as count FROM income');
    const phaseResult = await pool.query(`
      SELECT settlement_phase, COUNT(*) as count, SUM(amount) as total
      FROM income 
      GROUP BY settlement_phase 
      ORDER BY total DESC
    `);

    res.json({
      success: true,
      data: {
        totalIncome: parseFloat(totalResult.rows[0].total),
        totalRecords: parseInt(countResult.rows[0].count),
        byPhase: phaseResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching income stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch income statistics'
    });
  }
});

module.exports = router;