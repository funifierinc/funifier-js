import { Funifier } from '../..';
import { Player } from './player';
import { Token } from './token';

export type AuthProps = {
  funifierInstance: Funifier;
};

export type BasicProps = {
  client_secret: string;
};

export type PasswordProps = {
  username: string;
  password: string;
};

export interface AuthState {
  player: Player | null;
  token: Token | null;
}
