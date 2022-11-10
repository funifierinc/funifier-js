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

/**
 * The Funifier class is the main class of the SDK.
 * It is used to create an instance of the SDK and to set the configuration.
 * @example
 * const funifierInstance = Funifier.instance({
 *  service: "https://service2.funifier.com",
 *  api_key: "636d164af1c2641b440dfde9"
 * });
 */
export class Funifier {
  private static INSTANCE: Funifier;

  private service: string;
  private api_key: string;
  private bearerToken: string | null = null;
  private basicToken: string | null = null;

  private constructor({ service, api_key }: ConfigProps) {
    this.service = service;
    this.api_key = api_key;
  }

  /**
   * Get the singleton instance of the Funifier class.
   * @param config The configuration object.
   * @returns The singleton instance of the Funifier class.
   * @example
   * ```typescript
   * const funifier = Funifier.getInstance({
   *  service: "https://service2.funifier.com",
   *  api_key: "636d164af1c2641b440dfde9",
   * });
   * ```
   */
  public static instance({ service, api_key }: ConfigProps) {
    if (!Funifier.INSTANCE) {
      Funifier.INSTANCE = new Funifier({ service, api_key });
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
  public setToken(token: string) {
    this.bearerToken = token;
  }

  /**
   * Get the token in the funifier instance.
   * @returns The token in the funifier instance.
   * @example
   * ```typescript
   * const token = funifier.getToken();
   * ```
   */
  public getToken() {
    return this.bearerToken;
  }

  /**
   * Set the basic token in the funifier instance.
   * @returns void
   */
  public setBasicToken(token: string) {
    this.basicToken = token;
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
