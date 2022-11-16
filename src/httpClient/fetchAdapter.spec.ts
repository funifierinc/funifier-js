import { Funifier } from '../funifier';
import { FetchAdapter } from './fetchAdapter';
import { HttpClient } from './httpClient';

describe('FetchAdapter', () => {
  const service = 'https://url-service.funifier.com';
  const api_key = 'apiKey';
  let baseUrl: string;
  let fetchAdapter: HttpClient;
  let fetchMock: jest.SpyInstance;
  const defaultHeaders = {
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  };

  beforeEach(() => {
    Funifier.init({ service, api_key });
    baseUrl = Funifier.shared.getConfig().service;
    fetchAdapter = new FetchAdapter();
  });

  afterEach(() => {
    Funifier.destroy();
    jest.clearAllMocks();
    fetchMock.mockClear();
  });

  it('should to have be call with a default headers', async () => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'data' }),
        }) as any,
    );
    const endPoint = '/test';
    await fetchAdapter.get(endPoint);
    expect(fetchMock).toHaveBeenCalledWith(baseUrl + endPoint, defaultHeaders);
  });

  it('should to have be call with a custom headers', async () => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'data' }),
        }) as any,
    );
    const endPoint = '/test';
    const response = await fetchAdapter.get(endPoint, {
      headers: { range: 'items[0,100]' },
    });
    const expectedHeaders = {
      headers: {
        ...defaultHeaders.headers,
        range: 'items[0,100]',
      },
    };
    expect(response).toEqual({ data: 'data' });
    expect(fetchMock).toHaveBeenCalledWith(baseUrl + endPoint, expectedHeaders);
  });

  it('it should have a auth token after user login', async () => {
    Funifier.shared.setBearerToken('Bearer 123');
    fetchAdapter = new FetchAdapter();
    fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'data' }),
        }) as any,
    );
    const endPoint = '/test';
    const response = await fetchAdapter.get(endPoint);
    const expectedHeaders = {
      headers: {
        authorization: 'Bearer 123',
        ...defaultHeaders.headers,
      },
    };
    expect(response).toEqual({ data: 'data' });
    expect(fetchMock).toHaveBeenCalledWith(baseUrl + endPoint, expectedHeaders);
  });

  it('should get', async () => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'data' }),
        }) as any,
    );

    const endPoint = '/test';
    const response = await fetchAdapter.get(endPoint);
    expect(response).toEqual({ data: 'data' });
    expect(fetchMock).toHaveBeenCalledWith(baseUrl + endPoint, defaultHeaders);
  });

  it('should get with params', async () => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'data' }),
        }) as any,
    );

    const endPoint = '/test';
    const params = { param1: 'value1', param2: 'value2' };
    const response = await fetchAdapter.get(endPoint, { params });
    const expectedHeaders = {
      headers: {
        ...defaultHeaders.headers,
      },
    };
    expect(response).toEqual({ data: 'data' });
    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl + endPoint}?param1=value1&param2=value2`,
      expectedHeaders,
    );
  });

  it('should post', async () => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'data' }),
        }) as any,
    );

    const endPoint = '/test';
    const body = { data: 'data' };
    const expectedHeaders = Object.assign(defaultHeaders, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const response = await fetchAdapter.post(endPoint, { data: body });
    expect(response).toEqual({ data: 'data' });
    expect(fetchMock).toHaveBeenCalledWith(baseUrl + endPoint, expectedHeaders);
  });

  it('should put', async () => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'data' }),
        }) as any,
    );

    const endPoint = '/test';
    const body = { data: 'data' };
    const expectedHeaders = Object.assign(defaultHeaders, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const response = await fetchAdapter.put(endPoint, { data: body });
    expect(response).toEqual({ data: 'data' });
    expect(fetchMock).toHaveBeenCalledWith(baseUrl + endPoint, expectedHeaders);
  });

  it('should delete', async () => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementationOnce(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(),
        }) as any,
    );

    const endPoint = '/test/123';
    const expectedHeaders = {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      method: 'DELETE',
    };
    const response = await fetchAdapter.delete(endPoint);
    expect(response).toEqual(undefined);
    expect(fetchMock).toHaveBeenCalledWith(baseUrl + endPoint, expectedHeaders);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should throw error when get', async () => {
    fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(
        () => Promise.reject(new Error('Error on make a request')) as any,
      );

    const endPoint = '/test';
    try {
      await fetchAdapter.get(endPoint);
    } catch (error: any) {
      expect(error?.message).toBe('Error on make a request');
    }
  });

  it('should throw error when post', async () => {
    fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(
        () => Promise.reject(new Error('Error on make a request')) as any,
      );

    const endPoint = '/test';
    try {
      await fetchAdapter.post(endPoint, { data: 'data' });
    } catch (error: any) {
      expect(error?.message).toBe('Error on make a request');
    }
  });

  it('should throw error when put', async () => {
    fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(
        () => Promise.reject(new Error('Error on make a request')) as any,
      );

    const endPoint = '/test';
    try {
      await fetchAdapter.put(endPoint, { data: 'data' });
    } catch (error: any) {
      expect(error?.message).toBe('Error on make a request');
    }
  });

  it('should throw error when delete', async () => {
    fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce(
        () => Promise.reject(new Error('Error on make a request')) as any,
      );

    const endPoint = '/test';
    try {
      await fetchAdapter.delete(endPoint);
    } catch (error: any) {
      expect(error?.message).toBe('Error on make a request');
    }
  });
});
