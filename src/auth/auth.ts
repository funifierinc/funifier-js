import { Funifier } from '../funifier';
import { FetchAdapter } from '../httpClient/fetchAdapter';
import { HttpClient } from '../httpClient/httpClient';
import { BasicProps, PasswordProps } from '../types/auth/auth.type';
import { Token } from '../types/auth/token.type';

/**
 * Authentication class.
 * It is used to authenticate with the Funifier API.
 * You need a instance of Funifier to use this class.
 * @see {@link Funifier}
 * @example
 * ```typescript
 * import { Funifier } from '..';
 *
 * Funifier.init({
 *  api_key: 'your_api_key',
 *  service: 'https://your_service.funifier.com',
 * });
 * ```
 */
class Auth {
  constructor(private readonly httpClient: HttpClient) {}

  static authenticate(httpClient: HttpClient = new FetchAdapter()): Auth {
    return new Auth(httpClient);
  }

  /**
   * Authenticate with the Funifier API using the basic authentication method.
   * @param client_secret The client secret.
   * @returns The token.
   * @example
   * ```typescript
   * import { auth } from './auth';
   *
   * const token = auth().basic({
   *   client_secret: '456',
   * });
   * ```
   * @see {@link Token}
   */
  basic({ client_secret }: BasicProps) {
    const token = `Basic ${Buffer.from(
      `${Funifier.shared.getConfig().api_key}:${client_secret}`,
    ).toString('base64')}`;

    Funifier.shared.setBasicToken(token);

    return token;
  }

  /**
   * Authenticate with the Funifier API using the password authentication method.
   * @param username The username.
   * @param password The password.
   * @returns The token.
   * @example
   * ```typescript
   * import { Funifier } from '..';
   * import { auth } from './auth';
   *
   * const username = 'john.doe';
   * const password = '123456';
   * const token = await auth().password({ username, password });
   * ```
   * @see {@link Token}
   */
  async password({ username, password }: PasswordProps) {
    const payload = {
      apiKey: Funifier.shared.getConfig().api_key,
      grant_type: 'password',
      username,
      password,
    };

    const response = await this.httpClient.post<Token>(`/v3/auth/token`, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Cache-Control': 'no-cache',
      },
      data: payload,
    });

    if (response.access_token) {
      const bearerToken = `Bearer ${response.access_token}`;

      Funifier.shared.setBearerToken(bearerToken);

      return response;
    }

    if (response.message === 'password incorrect for player') {
      throw new Error('player or password incorrect');
    }

    if (response.message && response.message.includes('api_key invalid')) {
      throw new Error('api_key invalid');
    }

    throw new Error('unknown error');
  }
}

export const auth = Auth.authenticate;
