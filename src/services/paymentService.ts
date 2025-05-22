
import { get, post, put, patch, del } from './apiUtils';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  user: number;
  project: string;
  created_at: string;
}

const paymentService = {
  async getAllPayments() {
    return await get<Payment[]>(`/api/payments/`);
  },
  
  async createPayment(payment: Partial<Payment>) {
    return await post<Payment>(`/api/payments/`, payment);
  },
  
  async getPayment(paymentId: string) {
    return await get<Payment>(`/api/payments/${paymentId}/`);
  },
  
  async updatePayment(paymentId: string, payment: Partial<Payment>) {
    return await put<Payment>(`/api/payments/${paymentId}/`, payment);
  },
  
  async patchPayment(paymentId: string, payment: Partial<Payment>) {
    return await patch<Payment>(`/api/payments/${paymentId}/`, payment);
  },
  
  async deletePayment(paymentId: string) {
    return await del<void>(`/api/payments/${paymentId}/`);
  }
};

export { paymentService };
