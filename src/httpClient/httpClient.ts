export type HttpClientOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: Object;
};

export interface HttpClient {
  get<T>(url: string, options?: HttpClientOptions): Promise<T>;
  post<T>(url: string, options?: HttpClientOptions): Promise<T>;
  put<T>(url: string, options?: HttpClientOptions): Promise<T>;
  delete(url: string, options?: HttpClientOptions): Promise<void>;
}
