import { Funifier } from '../funifier';
import { ActionLog } from './actionLog';
describe('ActionLog', () => {
  const api_key = '123';
  const service = 'http://funifier.com';
  Funifier.init({
    api_key,
    service,
  });

  it('should create an action log', async () => {
    const mockedRequest = jest
      .spyOn(Funifier.HttpClient, 'post')
      .mockImplementationOnce(() =>
        Promise.resolve({
          _id: '123',
          ...actionLogInput,
        }),
      );

    const actionLogInput = {
      actionId: '123',
      userId: 'user@funifier.com',
      attributes: { product: 'book', price: 86.5, quantity: 1 },
    };
    const response = await ActionLog.create(actionLogInput);
    expect(response).toHaveProperty('_id');
    expect(response).toHaveProperty('actionId');
    expect(response).toHaveProperty('userId');
    expect(response).toHaveProperty('attributes');
    expect(mockedRequest).toHaveBeenCalledWith('/v3/action/log', {
      data: actionLogInput,
    });
  });

  it('should create an action log not async', async () => {
    const mockedRequest = jest
      .spyOn(Funifier.HttpClient, 'post')
      .mockImplementationOnce(() =>
        Promise.resolve({
          _id: '123',
          ...actionLogInput,
        }),
      );

    const actionLogInput = {
      actionId: '123',
      userId: 'user',
      attributes: { product: 'book', price: 86.5, quantity: 1 },
    };
    const response = await ActionLog.create(actionLogInput, false);
    expect(response).toHaveProperty('_id');
    expect(response).toHaveProperty('actionId');
    expect(response).toHaveProperty('userId');
    expect(response).toHaveProperty('attributes');
    expect(mockedRequest).toHaveBeenCalledWith('/v3/action/log?async=false', {
      data: actionLogInput,
    });
  });

  it('should delete an action log', async () => {
    const mockedRequest = jest
      .spyOn(Funifier.HttpClient, 'delete')
      .mockImplementationOnce(() => Promise.resolve({}) as any);

    const actionLogId = '123';
    const response = await ActionLog.delete(actionLogId);
    expect(response).toEqual({});
    expect(mockedRequest).toHaveBeenCalledWith('/v3/action/log/123');
  });
});
