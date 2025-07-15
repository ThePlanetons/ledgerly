import axios from 'axios';
import type { 
  Income, 
  Expense, 
  Balance, 
  DashboardSummary, 
  ChartData, 
  ApiResponse,
  FormData 
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Income API
export const incomeApi = {
  getAll: async (): Promise<ApiResponse<Income[]>> => {
    const response = await api.get('/income');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Income>> => {
    const response = await api.get(`/income/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<ApiResponse<Income>> => {
    const response = await api.post('/income', data);
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<ApiResponse<Income>> => {
    const response = await api.put(`/income/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/income/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/income/stats/summary');
    return response.data;
  },
};

// Expense API
export const expenseApi = {
  getAll: async (): Promise<ApiResponse<Expense[]>> => {
    const response = await api.get('/expense');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Expense>> => {
    const response = await api.get(`/expense/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<ApiResponse<Expense>> => {
    const response = await api.post('/expense', data);
    return response.data;
  },

  update: async (id: number, data: FormData): Promise<ApiResponse<Expense>> => {
    const response = await api.put(`/expense/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/expense/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/expense/stats/summary');
    return response.data;
  },

  getByTag: async (tag: string): Promise<ApiResponse<Expense[]>> => {
    const response = await api.get(`/expense/tag/${tag}`);
    return response.data;
  },

  getMonthlyStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/expense/stats/monthly');
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getBalance: async (): Promise<ApiResponse<Balance>> => {
    const response = await api.get('/dashboard/balance');
    return response.data;
  },

  getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  getMonthlyData: async (): Promise<ApiResponse<ChartData>> => {
    const response = await api.get('/dashboard/monthly-data');
    return response.data;
  },

  getExpenseBreakdown: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/dashboard/expense-breakdown');
    return response.data;
  },

  getIncomeBreakdown: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/dashboard/income-breakdown');
    return response.data;
  },

  getPaymentMethods: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/dashboard/payment-methods');
    return response.data;
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  const response = await api.get('/health');
  return response.data;
};

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
};

export default api;