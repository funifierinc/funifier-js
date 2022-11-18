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
          achievements,
        }),
      );

    const achievements = [
      {
        player: 'test',
        total: 1.0,
        type: 1,
        item: 'DyDJWYs',
        time: 1668718059637,
        _id: '63769deb20caaf4cb0a9f3e0',
      },
      {
        player: 'test',
        total: 1.0,
        type: 1,
        item: 'DyDJ7G6',
        time: 1668718059637,
        _id: '63769deb20caaf4cb0a9f3e1',
      },
    ];

    const actionLogInput = {
      actionId: '123',
      userId: 'user',
      attributes: { product: 'book', price: 86.5, quantity: 1 },
    };
    const response = await ActionLog.create(actionLogInput);
    expect(response).toHaveProperty('_id');
    expect(response).toHaveProperty('actionId');
    expect(response).toHaveProperty('userId');
    expect(response).toHaveProperty('attributes');
    expect(response).toHaveProperty('achievements');
    expect(mockedRequest).toHaveBeenCalledWith('/v3/action/log', {
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
