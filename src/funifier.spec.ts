import { Funifier } from './funifier';

describe('Funifier', () => {
  it('should throw an error if the funifier instance is not initialized', () => {
    expect(() => {
      Funifier.shared;
    }).toThrow(new Error('Funifier is not initialized'));
  });

  it('should throw an error if try to call Funifier.HttpClient without a Funifier instance', () => {
    expect(() => Funifier.HttpClient).toThrowError(
      'Funifier is not initialized',
    );
  });

  it('should create a new instance of Funifier', () => {
    const funifier = Funifier.init({
      service: 'test',
      api_key: '123',
    });

    expect(funifier).toBeInstanceOf(Funifier);
  });

  it('should throw an error if the service is not provided', () => {
    expect(() => {
      Funifier.init({
        api_key: '123',
      } as any);
    }).toThrow(new Error('Service is required'));
  });

  it('should throw an error if the api key is not provided', () => {
    expect(() => {
      Funifier.init({
        service: 'test',
      } as any);
    }).toThrow(new Error('Api key is required'));
  });

  it('should get the configuration object', () => {
    expect(Funifier.shared.getConfig()).toEqual({
      service: 'test',
      api_key: '123',
    });
  });

  it('should be able to set the valid bearer token', () => {
    Funifier.shared.setBearerToken('Bearer 123');

    expect(Funifier.shared.getBearerToken()).toEqual('Bearer 123');
  });

  it('should throw an error if the bearer token is not valid', () => {
    expect(() => {
      Funifier.shared.setBearerToken('123');
    }).toThrow(new Error('Invalid Bearer token'));
  });

  it('should be able to set the valid basic token', () => {
    Funifier.shared.setBasicToken('Basic 123');

    expect(Funifier.shared.getBasicToken()).toEqual('Basic 123');
  });

  it('should throw an error if the basic token is not valid', () => {
    expect(() => {
      Funifier.shared.setBasicToken('123');
    }).toThrow(new Error('Invalid Basic token'));
  });
});
