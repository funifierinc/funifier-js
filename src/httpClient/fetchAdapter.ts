import { StringBasic, StringBearer } from '../funifier';
import { HttpClient, HttpClientOptions } from './httpClient';

export class FetchAdapter implements HttpClient {
  private baseUrl: string;
  private bearerToken: StringBearer | null = null;
  private basicToken: StringBasic | null = null;

  constructor({ baseUrl }: { baseUrl: string }) {
    this.baseUrl = baseUrl;
  }

  setBearerToken(token: StringBearer): void {
    this.bearerToken = token;
  }
  setBasicToken(token: StringBasic): void {
    this.basicToken = token;
  }

  prepareHeaders(headers?: HeadersInit): HeadersInit {
    const token = this.basicToken || this.bearerToken || null;

    const defaultHeaders = new Headers({
      'Content-Type': 'application/json;charset=UTF-8',
      ...(token && { Authorization: token }),
      ...(headers && headers),
    });

    return Object.fromEntries(defaultHeaders.entries());
  }

  async get<T>(
    url: string,
    options?: HttpClientOptions | undefined,
  ): Promise<T> {
    const { headers, params } = options || {};
    const urlWithParams = new URL(`${this.baseUrl}${url}`);
    if (params) {
      Object.keys(params).forEach(key => {
        urlWithParams.searchParams.append(key, params[key]);
      });
    }
    return fetch(urlWithParams.toString(), {
      headers: this.prepareHeaders(headers),
    })
      .then(response => response.json())
      .catch(error => {
        throw new Error(error.message);
      });
  }

  async post<T>(
    url: string,
    options?: HttpClientOptions | undefined,
  ): Promise<T> {
    const { headers, data } = options || {};
    return await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: this.prepareHeaders(headers),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(error => {
        throw new Error(error.message);
      });
  }

  async put<T>(
    url: string,
    options?: HttpClientOptions | undefined,
  ): Promise<T> {
    const { headers, data } = options || {};
    return await fetch(`${this.baseUrl}${url}`, {
      method: 'PUT',
      headers: this.prepareHeaders(headers),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(error => {
        throw new Error(error.message);
      });
  }

  async delete(
    url: string,
    options?: HttpClientOptions | undefined,
  ): Promise<void> {
    const { headers } = options || {};
    await fetch(`${this.baseUrl}${url}`, {
      method: 'DELETE',
      headers: this.prepareHeaders(headers),
    })
      .then(() => {})
      .catch(error => {
        throw new Error(error.message);
      });
  }
}
