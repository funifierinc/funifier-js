import { Funifier } from '../funifier';
import { auth } from './auth';

describe('Auth', () => {
  const service = 'https://url-service.funifier.com';
  const api_key = 'apiKey';
  Funifier.init({ service, api_key });
  const username = 'player';
  const password = 'password';

  function mockedFetch(response: any) {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(response),
      }),
    );
  }

  beforeEach(() => {
    Funifier.init({ service, api_key });
  });

  describe('Basic', () => {
    it('should throw an error if funifierInstance is not provided', () => {
      Funifier.destroy();

      expect(() => auth().basic({ client_secret: 'secret' })).toThrow(
        new Error('Funifier is not initialized'),
      );
    });

    it('should authenticate with a basic authentication method', () => {
      const token = auth().basic({
        client_secret: '456',
      });

      expect(token).toContain('Basic');
    });

    it('should set the basic token in the funifier instance', () => {
      const token = auth().basic({
        client_secret: '456',
      });

      const basicToken = Funifier.shared.getBasicToken();

      expect(basicToken).toBe(token);
    });
  });

  describe('Password', () => {
    it('should authenticate with valid credentials using password authentication method', async () => {
      mockedFetch({
        access_token: '123',
        token_type: 'Bearer',
        expires_in: 123412341234,
      });

      const token = await auth().password({
        username,
        password,
      });

      expect(token).toHaveProperty('access_token');
      expect(token).toHaveProperty('token_type');
      expect(token).toHaveProperty('expires_in');
    });

    it('should not authenticate with invalid credentials using password authentication method', async () => {
      mockedFetch({
        message: 'password incorrect for player',
        statusCode: 500,
        data: null,
      });

      try {
        await auth().password({
          username: '-null-',
          password: '-null-',
        });
      } catch (error: any) {
        expect(error?.message).toBe('player or password incorrect');
      }
    });

    it('should set the Bearer token in the funifier instance', async () => {
      mockedFetch({
        access_token: '123',
        token_type: 'Bearer',
        expires_in: 123412341234,
      });

      const token = await auth().password({
        username,
        password,
      });

      const bearerToken = Funifier.shared.getBearerToken();

      expect(bearerToken).toBe(`Bearer ${token.access_token}`);
    });

    it('should throw an error if api_key is invalid', async () => {
      Funifier.destroy();

      Funifier.init({ service, api_key: 'invalid' });

      mockedFetch({
        message: 'api_key invalid',
        statusCode: 500,
        data: null,
      });

      try {
        await auth().password({
          username,
          password,
        });
      } catch (error: any) {
        expect(error?.message).toBe('api_key invalid');
      }
    });

    it('should to throw an error if message is unknown error', async () => {
      mockedFetch({
        message: 'unknown error',
        statusCode: 500,
        data: null,
      });

      try {
        await auth().password({
          username,
          password,
        });
      } catch (error: any) {
        expect(error?.message).toBe('unknown error');
      }
    });
  });
});
