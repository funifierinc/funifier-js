import { Funifier } from '../funifier';
import { Auth } from './auth';

describe('Auth', () => {
  const service = 'https://url-service.funifier.com';
  const api_key = 'apiKey';
  const funifierInstance = Funifier.instance({ service, api_key });
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

  describe('Basic', () => {
    it('should throw an error if funifierInstance is not provided', () => {
      expect(() => Auth.authenticate({} as any)).toThrowError(
        'Funifier instance is required',
      );
    });

    it('should authenticate with a basic authentication method', () => {
      const token = Auth.authenticate({ funifierInstance }).basic({
        client_secret: '456',
      });

      expect(token).toContain('Basic');
    });

    it('should set the basic token in the funifier instance', () => {
      const token = Auth.authenticate({ funifierInstance }).basic({
        client_secret: '456',
      });

      const basicToken = funifierInstance.getBasicToken();

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

      const token = await Auth.authenticate({ funifierInstance }).password({
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
        await Auth.authenticate({ funifierInstance }).password({
          username: '-null-',
          password: '-null-',
        });
      } catch (error: any) {
        expect(error?.message).toBe('player or password incorrect');
      }
    });

    it('should not authenticate with invalid api_key using password authentication method', async () => {
      mockedFetch({
        message:
          'api_key invalid, verify your game api_key in studio.funifier.com',
        statusCode: 500,
        data: null,
      });

      try {
        const tmpFunifierInstance = Funifier.instance({
          service,
          api_key: '-null-',
        });
        await Auth.authenticate({
          funifierInstance: tmpFunifierInstance,
        }).password({
          username,
          password,
        });
      } catch (error: any) {
        expect(error?.message).toBe('api_key invalid');
      }
    });

    it('should set the token in the funifier instance', async () => {
      mockedFetch({
        access_token: '123',
        token_type: 'Bearer',
        expires_in: 123412341234,
      });

      const token = await Auth.authenticate({ funifierInstance }).password({
        username,
        password,
      });

      const bearerToken = funifierInstance.getToken();

      expect(bearerToken).toBe(`Bearer ${token.access_token}`);
    });
  });
});
