import { get, post, put, patch, del } from './apiUtils';
import { Quote } from '../types';
import { ApiResponse } from './apiUtils';

const quoteService = {
  async getAllQuotes(): Promise<ApiResponse<Quote[]>> {
    return await get<Quote[]>(`/api/quotes/`);
  },
  
  async createQuote(quote: Partial<Quote>): Promise<ApiResponse<Quote>> {
    return await post<Quote>(`/api/quotes/`, quote);
  },
  
  async getQuote(quoteId: string): Promise<ApiResponse<Quote>> {
    return await get<Quote>(`/api/quotes/${quoteId}/`);
  },
  
  async updateQuote(quoteId: string, quote: Partial<Quote>): Promise<ApiResponse<Quote>> {
    return await put<Quote>(`/api/quotes/${quoteId}/`, quote);
  },
  
  async patchQuote(quoteId: string, quote: Partial<Quote>): Promise<ApiResponse<Quote>> {
    return await patch<Quote>(`/api/quotes/${quoteId}/`, quote);
  },
  
  async deleteQuote(quoteId: string): Promise<ApiResponse<void>> {
    return await del<void>(`/api/quotes/${quoteId}/`);
  },
  
  async updateQuoteStatus(quoteId: string, status: string): Promise<ApiResponse<any>> {
    return await patch<any>(`/api/quotes/${quoteId}/update-status/`, { status });
  },
  
  async getQuotesByProject(projectId: string): Promise<ApiResponse<Quote[]>> {
    return await get<Quote[]>(`/api/quotes/by-project/${projectId}/`);
  }
};

export { quoteService };