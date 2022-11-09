type ConfigProps = {
  service: string;
  api_key: string;
};

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

  public static instance({ service, api_key }: ConfigProps) {
    if (!Funifier.INSTANCE) {
      Funifier.INSTANCE = new Funifier({ service, api_key });
    }

    return Funifier.INSTANCE;
  }

  public getConfig() {
    return {
      service: this.service,
      api_key: this.api_key,
    };
  }

  public setToken(token: string) {
    this.bearerToken = token;
  }

  public getToken() {
    return this.bearerToken;
  }

  public setBasicToken(token: string) {
    this.basicToken = token;
  }

  public getBasicToken() {
    return this.basicToken;
  }
}
