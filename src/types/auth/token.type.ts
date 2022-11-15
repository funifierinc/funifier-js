export type Token = {
  /**
   * The token
   */
  access_token: string;
  /**
   * The token type
   * @example Bearer
   */
  token_type: string;
  /**
   * The token expiration date in unix timestamp
   * @example 1590000000
   */
  expires_in: number;

  /**
   * If the are a error, this will be the error message
   * @example player or password incorrect
   * @example api_key invalid
   */
  message?: string;
};
