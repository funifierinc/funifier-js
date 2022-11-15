import { Funifier, StringBasic, StringBearer } from '../funifier';
import { HttpClient, HttpClientOptions } from './httpClient';

export class FetchAdapter implements HttpClient {
  private baseUrl: string;
  private bearerToken: StringBearer | null = null;
  private basicToken: StringBasic | null = null;

  constructor() {
    this.baseUrl = Funifier.shared.getConfig().service;
    this.basicToken = Funifier.shared.getBasicToken();
    this.bearerToken = Funifier.shared.getBearerToken();
  }

  async get<T>(
    url: string,
    options?: HttpClientOptions | undefined,
  ): Promise<T> {
    try {
      const { headers, params } = options || {};
      const urlWithParams = new URL(`${this.baseUrl}${url}`);
      if (params) {
        Object.keys(params).forEach(key => {
          urlWithParams.searchParams.append(key, params[key]);
        });
      }
      return fetch(urlWithParams.toString(), {
        headers,
      }).then(response => response.json());
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
      throw error;
    }
  }

  async post<T>(
    url: string,
    options?: HttpClientOptions | undefined,
  ): Promise<T> {
    try {
      const { headers, data } = options || {};
      return await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }).then(response => response.json());
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
      throw error;
    }
  }

  async put<T>(
    url: string,
    options?: HttpClientOptions | undefined,
  ): Promise<T> {
    try {
      const { headers, data } = options || {};
      return await fetch(`${this.baseUrl}${url}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      }).then(response => response.json());
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
      throw error;
    }
  }

  async delete<T>(
    url: string,
    options?: HttpClientOptions | undefined,
  ): Promise<T> {
    try {
      const { headers } = options || {};
      return await fetch(`${this.baseUrl}${url}`, {
        method: 'DELETE',
        headers,
      }).then(response => response.json());
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
      throw error;
    }
  }
}
