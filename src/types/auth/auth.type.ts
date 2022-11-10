import { Funifier } from '../../funifier';
import { Player } from './player.type';
import { Token } from './token.type';

export type AuthProps = {
  /**
   * The Funifier instance.
   * @example
   * ```typescript
   * const funifier = new Funifier({ service, api_key });
   * ```
   * @see {@link Funifier}
   * @see {@link Funifier.instance}
   */
  funifierInstance: Funifier;
};

export type BasicProps = {
  /**
   * The client secret.
   */
  client_secret: string;
};

export type PasswordProps = {
  /**
   * The username.
   * @example
   * ```typescript
   * const username = 'john.doe';
   * ```
   */
  username: string;
  /**
   * The password.
   * @example
   * ```typescript
   * const password = '123456';
   * ```
   */
  password: string;
};

export interface AuthState {
  player: Player | null;
  token: Token | null;
}
