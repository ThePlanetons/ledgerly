import React from 'react';
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Plus 
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onAddClick 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'expense', label: 'Expense', icon: TrendingDown },
    { id: 'charts', label: 'Charts', icon: BarChart3 },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200/50 z-40">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon 
                  size={20} 
                  className={`mb-1 transition-colors duration-200 ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`} 
                />
                <span className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating Add Button */}
      <button
        onClick={onAddClick}
        className="floating-button animate-bounce-in"
        aria-label="Add new transaction"
      >
        <Plus size={24} />
      </button>
    </>
  );
};

export default Navigation;