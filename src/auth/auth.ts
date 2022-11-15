import { Funifier } from '../funifier';
import { FetchAdapter } from '../httpClient/fetchAdapter';
import { HttpClient } from '../httpClient/httpClient';
import { BasicProps, PasswordProps } from '../types/auth/auth.type';
import { Token } from '../types/auth/token.type';

/**
 * Authentication class.
 * It is used to authenticate with the Funifier API.
 */
export class Auth {
  constructor(private readonly httpClient: HttpClient) {}

  static authenticate() {
    return new Auth(new FetchAdapter());
  }

  /**
   * Authenticate with the Funifier API using the basic authentication method.
   * @param client_secret The client secret.
   * @returns The token.
   * @example
   * ```typescript
   * import { Funifier } from '..';
   * import { Auth } from './auth';
   *
   * const token = Auth.authenticate({ funifierInstance }).basic({
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
   * import { Auth } from './auth';
   *
   * const username = 'john.doe';
   * const password = '123456';
   * const token = await Auth.authenticate({ funifierInstance }).password({ username, password });
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

    if (response && response.message === 'password incorrect for player') {
      throw new Error('player or password incorrect');
    }

    if (response && response.message?.includes('api_key invalid')) {
      throw new Error('api_key invalid');
    }

    throw new Error('unknown error');
  }
}
