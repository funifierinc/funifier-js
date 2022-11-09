import { Funifier } from '..';
import { AuthProps, BasicProps, PasswordProps } from '../types/auth/auth';
import { Token } from '../types/auth/token';

export class Auth {
  private funifierInstance: Funifier;

  constructor({ funifierInstance }: AuthProps) {
    if (!funifierInstance) {
      throw new Error('Funifier instance is required');
    }

    this.funifierInstance = funifierInstance;
  }

  static authenticate({ funifierInstance }: AuthProps) {
    return new Auth({ funifierInstance });
  }

  basic({ client_secret }: BasicProps) {
    const token = `Basic ${Buffer.from(
      `${this.funifierInstance.getConfig().api_key}:${client_secret}`,
    ).toString('base64')}`;

    this.funifierInstance.setBasicToken(token);

    return token;
  }

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
