type ConfigProps = {
  /**
   * The url of the server to connect to.
   * @example "https://service2.funifier.com"
   */
  service: string;
  /**
   * The api key of the project.
   * @example "636d164af1c2641b440dfde9"
   */
  api_key: string;
};

export type StringBasic = `Basic ${string}`;
export type StringBearer = `Bearer ${string}`;

/**
 * The Funifier class is the main class of the SDK.
 * It is used to create an instance of the SDK and to set the configuration.
 * @example
 * const funifierInstance = Funifier.init({
 *  service: "https://service2.funifier.com",
 *  api_key: "636d164af1c2641b440dfde9"
 * });
 */
export class Funifier {
  private static INSTANCE: Funifier | null;

  private service: string;
  private api_key: string;
  private bearerToken: StringBearer | null = null;
  private basicToken: StringBasic | null = null;

  private constructor({ service, api_key }: ConfigProps) {
    this.service = service;
    this.api_key = api_key;
  }

  /**
   * Initialize the funifier instance.
   * @returns The funifier instance.
   * @example
   * ```typescript
   * const funifierInstance = Funifier.init({
   * service: "https://service2.funifier.com",
   * api_key: "636d164af1c2641b440dfde9"
   * });
   * ```
   */
  public static init({ service, api_key }: ConfigProps) {
    if (!service) throw new Error('Service is required');
    if (!api_key) throw new Error('Api key is required');

    if (!Funifier.INSTANCE) {
      Funifier.INSTANCE = new Funifier({ service, api_key });
    }

    return Funifier.INSTANCE;
  }

  /**
   * Destroy the funifier instance.
   * @returns void
   * @example
   * ```typescript
   * Funifier.destroy();
   * ```
   */
  public static destroy() {
    Funifier.INSTANCE = null;
  }

  /**
   * Get the the funifier instance. If the instance is not initialized, it will throw an error.
   * @returns The funifier instance.
   * @example
   * ```typescript
   * const funifierInstance = Funifier.instance({
   * service: "https://service2.funifier.com",
   * api_key: "636d164af1c2641b440dfde9"
   * });
   *
   * const funifierInstance = Funifier.shared;
   * ```
   * @see {@link Funifier.init}
   */
  public static get shared() {
    if (!Funifier.INSTANCE) {
      throw new Error('Funifier is not initialized');
    }

    return Funifier.INSTANCE;
  }

  /**
   * Get configuration object.
   * @returns The configuration object.
   * @example
   * ```typescript
   * const config = funifier.getConfig();
   * ```
   */
  public getConfig() {
    return {
      service: this.service,
      api_key: this.api_key,
    };
  }

  /**
   * Set the token in the funifier instance.
   * @returns void
   */
  public setBearerToken(token: string) {
    if (!token.match(/^Bearer\s.*/g)) {
      throw new Error('Invalid Bearer token');
    }
    this.bearerToken = token as StringBearer;
  }

  /**
   * Get the token in the funifier instance.
   * @returns The token in the funifier instance.
   * @example
   * ```typescript
   * const token = funifier.getToken();
   * ```
   */
  public getBearerToken() {
    return this.bearerToken;
  }

  /**
   * Set the basic token in the funifier instance.
   * @returns void
   */
  public setBasicToken(token: string) {
    if (!token.match(/^Basic\s.*/g)) {
      throw new Error('Invalid Basic token');
    }
    this.basicToken = token as StringBasic;
  }

  /**
   * Get the basic token in the funifier instance.
   * @returns The basic token in the funifier instance.
   * @example
   * ```typescript
   * const token = funifier.getBasicToken();
   * ```
   */
  public getBasicToken() {
    return this.basicToken;
  }
}
