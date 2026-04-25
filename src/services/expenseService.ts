import { apiService } from './apiService';

export interface Expense {
  id: number;
  name: string;
  category: string;
  amount: number;
  expenseDate: string;
  description: string;
  shopId: number;
  shopName?: string;
  createdById?: number;
  createdByName?: string;
}

export interface CreateExpenseRequest {
  name: string;
  category: string;
  amount: number;
  expenseDate: string;
  description: string;
  paymentMethod: string;
  status?: 'paid' | 'pending';
  shopId: number;
}

class ExpenseService {
  async getAllExpenses(): Promise<Expense[]> {
    const response = await apiService.get('/expenses');
    return response.data.data;
  }

  async getExpensesByShop(shopId: number): Promise<Expense[]> {
    const response = await apiService.get(`/expenses/shop/${shopId}`);
    return response.data.data;
  }

  async getExpensesByDateRange(shopId: number, startDate: string, endDate: string): Promise<Expense[]> {
    const response = await apiService.get(`/expenses/shop/${shopId}/range`, {
      params: { start: startDate, end: endDate }
    });
    return response.data.data;
  }

  async createExpense(expense: CreateExpenseRequest): Promise<Expense> {
    const response = await apiService.post('/expenses', expense);
    return response.data.data;
  }

  async updateExpense(id: number, expense: Partial<CreateExpenseRequest>): Promise<Expense> {
    const response = await apiService.put(`/expenses/${id}`, expense);
    return response.data.data;
  }

  async deleteExpense(id: number): Promise<void> {
    await apiService.delete(`/expenses/${id}`);
  }
}

export default new ExpenseService();
