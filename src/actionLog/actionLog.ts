import { Funifier } from '../funifier';

export type ActionLogInput = {
  /**
   * The action log id.
   * @example "123"
   */
  actionId: string;
  /**
   * The user id.
   * @example "user"
   */
  userId: string;
  /**
   * The action log attributes.
   * @example { product: 'book', price: 86.5, quantity: 1 }
   * @type {object}
   */
  attributes: Record<string, any>;
};

export type Achievement = {
  player: string;
  total: number;
  type: number;
  item: string;
  time: number;
  _id: string;
};

export type ActionLogOutput = {
  _id: string;
} & ActionLogInput;

export type ActionLogSyncOutput = {
  _id: string;
  achievements?: Achievement[];
} & ActionLogInput;

/**
 * The ActionLog class is used to create an action log.
 * @example
 * ```typescript
 * import { ActionLog } from 'funifier-js';
 *
 * const actionLogInput = {
 *  actionId: '123',
 * userId: 'userId',
 * attributes: { product: 'book', price: 86.5, quantity: 1 },
 * };
 * const response = await ActionLog.create(actionLogInput);
 * ```
 */
export class ActionLog {
  /**
   * Create an action log.
   * @param actionLogInput The action log input.
   * @returns The action log output.
   * @example
   * ```typescript
   * import { ActionLog } from 'funifier-js';
   *
   * const actionLogInput = {
   * actionId: '123',
   * userId: 'userId',
   * attributes: { product: 'book', price: 86.5, quantity: 1 },
   * };
   * const output = await ActionLog.create(actionLogInput);
   * ```
   */
  static async create(actionLogInput: ActionLogInput) {
    const url = '/v3/action/log';
    return Funifier.HttpClient.post<ActionLogOutput>(url, {
      data: actionLogInput,
    });
  }

  /**
   * Create an action log sync.
   * In this case, if the player has achieved any achievement, it will be returned.
   * @param actionLogInput The action log input.
   * @returns The action log output.
   * @example
   * ```typescript
   * import { ActionLog } from 'funifier-js';
   *
   * const actionLogInput = {
   * actionId: '123',
   * userId: 'userId',
   * attributes: { product: 'book', price: 86.5, quantity: 1 },
   * };
   * const output = await ActionLog.createSync(actionLogInput);
   * ```
   */
  static async createSync(actionLogInput: ActionLogInput) {
    const url = '/v3/action/log?async=false';
    return Funifier.HttpClient.post<ActionLogSyncOutput>(url, {
      data: actionLogInput,
    });
  }

  /**
   * Delete an action log.
   * @param actionLogId The action log id.
   * @returns void.
   * @example
   * ```typescript
   * import { ActionLog } from 'funifier-js';
   * const output = await ActionLog.delete('123');
   * ```
   */
  static async delete(actionLogId: string) {
    return Funifier.HttpClient.delete(`/v3/action/log/${actionLogId}`);
  }
}
