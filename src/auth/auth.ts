import { Funifier } from '../funifier';
import { AuthProps, BasicProps, PasswordProps } from '../types/auth/auth.type';
import { Token } from '../types/auth/token.type';

/**
 * Authentication class.
 * It is used to authenticate with the Funifier API.
 */
export class Auth {
  private funifierInstance: Funifier;

  /**
   * Get the singleton instance of the Auth class.
   * @param funifierInstance The Funifier instance.
   */
  constructor({ funifierInstance }: AuthProps) {
    if (!funifierInstance) {
      throw new Error('Funifier instance is required');
    }

    this.funifierInstance = funifierInstance;
  }

  /**
   * Get the Funifier instance.
   * @returns The Funifier instance.
   * @example
   * ```typescript
   * const funifierInstance = auth.getFunifierInstance();
   * ```
   * @see {@link Funifier}
   * @see {@link Funifier.instance}
   */
  static authenticate({ funifierInstance }: AuthProps) {
    return new Auth({ funifierInstance });
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
      `${this.funifierInstance.getConfig().api_key}:${client_secret}`,
    ).toString('base64')}`;

    this.funifierInstance.setBasicToken(token);

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
      apiKey: this.funifierInstance.getConfig().api_key,
      grant_type: 'password',
      username,
      password,
    };

    const response = await fetch(
      `${this.funifierInstance.getConfig().service}/v3/auth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(payload),
      },
    );

    const responseParsed = await response.json();

    if (responseParsed.access_token) {
      const bearerToken = `Bearer ${responseParsed.access_token}`;

      this.funifierInstance.setToken(bearerToken);

      return responseParsed as Token;
    }

    if (responseParsed?.message === 'password incorrect for player') {
      throw new Error('player or password incorrect');
    }

    if (responseParsed?.message.includes('api_key invalid')) {
      throw new Error('api_key invalid');
    }

    throw new Error('unknown error');
  }
}