import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import { healthCheck } from './services/api';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'income' | 'expense'>('income');
  const [apiConnected, setApiConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await healthCheck();
        setApiConnected(true);
      } catch (error) {
        console.error('API connection failed:', error);
        setApiConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddClick = () => {
    setAddModalType('income');
    setShowAddModal(true);
  };

  const handleAddTransaction = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onAddTransaction={handleAddTransaction} />;
      case 'income':
        return <ComingSoon title="Income" description="Income tracking features coming soon!" />;
      case 'expense':
        return <ComingSoon title="Expense" description="Expense tracking features coming soon!" />;
      case 'charts':
        return <ComingSoon title="Charts" description="Chart visualization features coming soon!" />;
      default:
        return <Dashboard onAddTransaction={handleAddTransaction} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-blue/20 to-pastel-pink/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!apiConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-blue/20 to-pastel-pink/20 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">🔌</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">API Connection Failed</h1>
            <p className="text-gray-600 mb-6">
              Please make sure the backend server is running on port 5000.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/20 to-pastel-pink/20">
      {/* Main Content */}
      <main className="pb-20">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddClick={handleAddClick}
      />

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content animate-slide-up">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add Transaction</h2>
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setAddModalType('income')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    addModalType === 'income'
                      ? 'bg-success-100 text-success-700 border-2 border-success-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setAddModalType('expense')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    addModalType === 'expense'
                      ? 'bg-danger-100 text-danger-700 border-2 border-danger-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                  }`}
                >
                  Expense
                </button>
              </div>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🚧</div>
                <p className="text-gray-600 mb-6">
                  {addModalType === 'income' ? 'Income' : 'Expense'} form coming soon!
                </p>
                <button
                  onClick={handleCloseModal}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Coming Soon Component
const ComingSoon: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/10 to-pastel-pink/10 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-2xl font-bold gradient-text mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="animate-pulse">
            <div className="h-4 bg-gradient-to-r from-primary-200 to-primary-300 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
