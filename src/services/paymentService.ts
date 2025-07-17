
import { get, post, put, patch, del } from './apiUtils';
import { Payment } from '../types';
import { ApiResponse } from './apiUtils';

const paymentService = {
  async getAllPayments(): Promise<ApiResponse<Payment[]>> {
    return await get<Payment[]>(`/api/payments/`);
  },
  
  async createPayment(payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return await post<Payment>(`/api/payments/`, payment);
  },
  
  async getPayment(paymentId: string): Promise<ApiResponse<Payment>> {
    return await get<Payment>(`/api/payments/${paymentId}/`);
  },
  
  async updatePayment(paymentId: string, payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return await put<Payment>(`/api/payments/${paymentId}/`, payment);
  },
  
  async patchPayment(paymentId: string, payment: Partial<Payment>): Promise<ApiResponse<Payment>> {
    return await patch<Payment>(`/api/payments/${paymentId}/`, payment);
  },
  
  async deletePayment(paymentId: string): Promise<ApiResponse<void>> {
    return await del<void>(`/api/payments/${paymentId}/`);
  },
  
  async verifyPayment(paymentId: string, status: string, adminNotes?: string): Promise<ApiResponse<any>> {
    return await patch<any>(`/api/payments/${paymentId}/verify/`, { 
      status, 
      admin_notes: adminNotes 
    });
  },
  
  async getPaymentsByProject(projectId: string): Promise<ApiResponse<Payment[]>> {
    return await get<Payment[]>(`/api/payments/?project=${projectId}`);
  }
};

export { paymentService };
