import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { dashboardApi, formatCurrency, formatDate, getRelativeTime } from '../services/api';
import type { DashboardSummary, Balance } from '../types';

interface DashboardProps {
  onAddTransaction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAddTransaction }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [summaryResponse, balanceResponse] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getBalance()
      ]);

      if (summaryResponse.success && summaryResponse.data) {
        setSummary(summaryResponse.data);
      }
      
      if (balanceResponse.success && balanceResponse.data) {
        setBalance(balanceResponse.data);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <AlertCircle className="text-danger-500 mb-4" size={48} />
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button onClick={handleRefresh} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/10 to-pastel-pink/10 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
            <p className="text-gray-600 text-sm">Track your finances</p>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-full bg-primary-100 text-primary-600 transition-all duration-200 ${
              refreshing ? 'animate-spin' : 'hover:bg-primary-200'
            }`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Balance Card */}
        {balance && (
          <div className={`card ${balance.balanceStatus === 'positive' ? 'balance-positive' : 'balance-negative'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/50 rounded-full">
                  <Wallet size={24} className="text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Current Balance</h3>
                  <p className="text-sm text-gray-600">
                    Updated {getRelativeTime(new Date().toISOString())}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(balance.currentBalance)}
              </p>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Income</p>
                  <p className="font-semibold text-success-600">
                    {formatCurrency(balance.totalIncome)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Expense</p>
                  <p className="font-semibold text-danger-600">
                    {formatCurrency(balance.totalExpense)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 gap-4">
            <div className="card income-card">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="text-success-600" size={24} />
                <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full">
                  {summary.counts.incomeRecords}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Income</p>
              <p className="text-lg font-bold text-success-700">
                {formatCurrency(summary.balance.totalIncome)}
              </p>
            </div>

            <div className="card expense-card">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="text-danger-600" size={24} />
                <span className="text-xs text-danger-600 bg-danger-100 px-2 py-1 rounded-full">
                  {summary.counts.expenseRecords}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Expense</p>
              <p className="text-lg font-bold text-danger-700">
                {formatCurrency(summary.balance.totalExpense)}
              </p>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {summary && summary.recentTransactions.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
              <Calendar className="text-gray-500" size={20} />
            </div>
            <div className="space-y-3">
              {summary.recentTransactions.slice(0, 5).map((transaction, index) => (
                <div key={index} className="transaction-item bg-gray-50/50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`tag ${transaction.type === 'income' ? 'tag-income' : 'tag-expense'}`}>
                        {transaction.type}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800">{transaction.name}</p>
                    <p className="text-sm text-gray-600">{transaction.secondary}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Expense Categories */}
        {summary && summary.topExpenseTags.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">Top Expense Categories</h3>
            </div>
            <div className="space-y-2">
              {summary.topExpenseTags.slice(0, 3).map((tag, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-pastel-orange/20 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{tag.expense_tag}</p>
                    <p className="text-sm text-gray-600">{tag.count} transactions</p>
                  </div>
                  <p className="font-semibold text-danger-600">
                    {formatCurrency(tag.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settlement Phases */}
        {summary && summary.settlementPhases.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-800">Income by Phase</h3>
            </div>
            <div className="space-y-2">
              {summary.settlementPhases.slice(0, 3).map((phase, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-pastel-mint/20 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{phase.settlement_phase}</p>
                    <p className="text-sm text-gray-600">{phase.count} projects</p>
                  </div>
                  <p className="font-semibold text-success-600">
                    {formatCurrency(phase.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onAddTransaction}
              className="btn-primary"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Add Income
            </button>
            <button
              onClick={onAddTransaction}
              className="btn-secondary"
            >
              <TrendingDown className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;