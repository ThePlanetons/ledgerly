const express = require('express');
const router = express.Router();
const pool = require('../database');

// Get current balance (total income - total expense)
router.get('/balance', async (req, res) => {
  try {
    const incomeResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total_income FROM income');
    const expenseResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total_expense FROM expense');
    
    const totalIncome = parseFloat(incomeResult.rows[0].total_income);
    const totalExpense = parseFloat(expenseResult.rows[0].total_expense);
    const currentBalance = totalIncome - totalExpense;
    
    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        currentBalance,
        balanceStatus: currentBalance >= 0 ? 'positive' : 'negative'
      }
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance'
    });
  }
});

// Get comprehensive dashboard summary
router.get('/summary', async (req, res) => {
  try {
    // Get total income and expense
    const incomeResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total_income FROM income');
    const expenseResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total_expense FROM expense');
    
    // Get counts
    const incomeCountResult = await pool.query('SELECT COUNT(*) as count FROM income');
    const expenseCountResult = await pool.query('SELECT COUNT(*) as count FROM expense');
    
    // Get recent transactions
    const recentIncomeResult = await pool.query(`
      SELECT 'income' as type, project_name as name, client_name as secondary, amount, settlement_date as date
      FROM income 
      ORDER BY settlement_date DESC, created_at DESC 
      LIMIT 5
    `);
    
    const recentExpenseResult = await pool.query(`
      SELECT 'expense' as type, name, expense_tag as secondary, amount, date
      FROM expense 
      ORDER BY date DESC, created_at DESC 
      LIMIT 5
    `);
    
    // Get top expense categories
    const topExpenseTagsResult = await pool.query(`
      SELECT expense_tag, COUNT(*) as count, SUM(amount) as total
      FROM expense 
      GROUP BY expense_tag 
      ORDER BY total DESC 
      LIMIT 5
    `);
    
    // Get settlement phases summary
    const settlementPhasesResult = await pool.query(`
      SELECT settlement_phase, COUNT(*) as count, SUM(amount) as total
      FROM income 
      GROUP BY settlement_phase 
      ORDER BY total DESC
    `);
    
    // Calculate balance
    const totalIncome = parseFloat(incomeResult.rows[0].total_income);
    const totalExpense = parseFloat(expenseResult.rows[0].total_expense);
    const currentBalance = totalIncome - totalExpense;
    
    // Combine recent transactions and sort by date
    const recentTransactions = [...recentIncomeResult.rows, ...recentExpenseResult.rows]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    res.json({
      success: true,
      data: {
        balance: {
          totalIncome,
          totalExpense,
          currentBalance,
          balanceStatus: currentBalance >= 0 ? 'positive' : 'negative'
        },
        counts: {
          incomeRecords: parseInt(incomeCountResult.rows[0].count),
          expenseRecords: parseInt(expenseCountResult.rows[0].count)
        },
        recentTransactions,
        topExpenseTags: topExpenseTagsResult.rows,
        settlementPhases: settlementPhasesResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard summary'
    });
  }
});

// Get monthly data for charts
router.get('/monthly-data', async (req, res) => {
  try {
    // Get monthly income data
    const monthlyIncomeResult = await pool.query(`
      SELECT 
        DATE_TRUNC('month', settlement_date) as month,
        SUM(amount) as total,
        COUNT(*) as count
      FROM income 
      GROUP BY DATE_TRUNC('month', settlement_date)
      ORDER BY month DESC
      LIMIT 12
    `);
    
    // Get monthly expense data
    const monthlyExpenseResult = await pool.query(`
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
      data: {
        monthlyIncome: monthlyIncomeResult.rows,
        monthlyExpense: monthlyExpenseResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly data'
    });
  }
});

// Get expense breakdown by category
router.get('/expense-breakdown', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        expense_tag as category,
        SUM(amount) as total,
        COUNT(*) as count,
        AVG(amount) as average
      FROM expense 
      GROUP BY expense_tag 
      ORDER BY total DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching expense breakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense breakdown'
    });
  }
});

// Get income breakdown by settlement phase
router.get('/income-breakdown', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        settlement_phase as phase,
        SUM(amount) as total,
        COUNT(*) as count,
        AVG(amount) as average
      FROM income 
      GROUP BY settlement_phase 
      ORDER BY total DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching income breakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch income breakdown'
    });
  }
});

// Get payment method analysis
router.get('/payment-methods', async (req, res) => {
  try {
    const incomePaymentResult = await pool.query(`
      SELECT 
        payment_type,
        'income' as type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM income 
      GROUP BY payment_type
    `);
    
    const expensePaymentResult = await pool.query(`
      SELECT 
        payment_type,
        'expense' as type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM expense 
      GROUP BY payment_type
    `);
    
    res.json({
      success: true,
      data: {
        incomePaymentMethods: incomePaymentResult.rows,
        expensePaymentMethods: expensePaymentResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment methods'
    });
  }
});

module.exports = router;