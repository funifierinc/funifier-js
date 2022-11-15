export type HttpClientOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: Record<string, string>;
};

export interface HttpClient {
  get<T>(url: string, options?: HttpClientOptions): Promise<T>;
  post<T>(url: string, options?: HttpClientOptions): Promise<T>;
  put<T>(url: string, options?: HttpClientOptions): Promise<T>;
  delete<T>(url: string, options?: HttpClientOptions): Promise<T>;
}
