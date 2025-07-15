export interface Income {
  id: number;
  project_name: string;
  client_name: string;
  amount: number;
  settlement_date: string;
  settlement_phase: string;
  source_person: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  name: string;
  date: string;
  amount: number;
  expense_tag: string;
  spent_person: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
}

export interface Balance {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  balanceStatus: 'positive' | 'negative';
}

export interface DashboardSummary {
  balance: Balance;
  counts: {
    incomeRecords: number;
    expenseRecords: number;
  };
  recentTransactions: Transaction[];
  topExpenseTags: CategorySummary[];
  settlementPhases: PhaseSummary[];
}

export interface Transaction {
  type: 'income' | 'expense';
  name: string;
  secondary: string;
  amount: number;
  date: string;
}

export interface CategorySummary {
  expense_tag: string;
  count: number;
  total: number;
}

export interface PhaseSummary {
  settlement_phase: string;
  count: number;
  total: number;
}

export interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export interface ChartData {
  monthlyIncome: MonthlyData[];
  monthlyExpense: MonthlyData[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}

export interface FormData {
  // Income form data
  project_name?: string;
  client_name?: string;
  amount?: number | string;
  settlement_date?: string;
  settlement_phase?: string;
  source_person?: string;
  payment_type?: string;
  
  // Expense form data
  name?: string;
  date?: string;
  expense_tag?: string;
  spent_person?: string;
}

export const SETTLEMENT_PHASES = [
  'Phase 1',
  'Phase 2',
  'Phase 3',
  'Phase 4',
  'Phase 5',
  'Final Phase',
  'Bonus'
] as const;

export const EXPENSE_TAGS = [
  'WiFi Bill',
  'Electricity Bill',
  'Maintenance',
  'Lunch',
  'Dinner',
  'Transport',
  'Groceries',
  'Rent',
  'Entertainment',
  'Healthcare',
  'Education',
  'Shopping',
  'Other'
] as const;

export const PAYMENT_TYPES = [
  'Account',
  'Google Pay',
  'PhonePe',
  'Paytm',
  'UPI',
  'Cash',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Other'
] as const;

export type SettlementPhase = typeof SETTLEMENT_PHASES[number];
export type ExpenseTag = typeof EXPENSE_TAGS[number];
export type PaymentType = typeof PAYMENT_TYPES[number];