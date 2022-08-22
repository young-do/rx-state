import { Observable, Subject } from 'rxjs';
import { createLabelerWithCount } from './utils/generate-label';
import { generateKey } from './utils/gerenate-key';
import { logForAction } from './utils/logger';

export type Action<T = void> = {
  (payload: T): ActionTuple<T>;
  getKey: () => string;
  debugLabel: string;
};
export type ActionTuple<T> = [key: string, debugLabel: string, payload: T];

const actionManager = {
  map: Object.create(null) as Record<string, Subject<unknown>>,
  get(key: string) {
    const subject = this.map[key];
    if (!subject) throw new Error(`[rx-state] Internal Error: Action ${key} has not been declared yet.`);
    return subject;
  },
  set(key: string) {
    const subject = new Subject();
    if (this.map[key]) throw new Error(`[rx-state] Internal Error: Action ${key} already exists.`);
    return (this.map[key] = subject);
  },
};
const getDefaultLabel = createLabelerWithCount('unnamed_action');

export function createAction<T = void>(debugLabel?: string): Action<T> {
  const key = `#${generateKey()}`;
  actionManager.set(key);

  const action = ((payload: T) => [key, action.debugLabel, payload]) as Action<T>;
  action.getKey = () => key;
  action.debugLabel = debugLabel || getDefaultLabel();

  return action;
}

export function dispatch<T = void>(ActionTuple: ActionTuple<T>): void;
export function dispatch<T = void>(action: Action<T>, payload: T): void;
export function dispatch<T extends void>(action: Action<T>): void;
export function dispatch<T = void>(actionOrActionTuple: Action<T> | ActionTuple<T>, payload?: T) {
  const isAction = typeof actionOrActionTuple === 'function';

  const key = isAction ? actionOrActionTuple.getKey() : actionOrActionTuple[0];
  const debugLabel = isAction ? actionOrActionTuple.debugLabel : actionOrActionTuple[1];
  payload = isAction ? payload : actionOrActionTuple[2];

  const subject = actionManager.get(key);

  logForAction(debugLabel, payload);

  subject.next(payload);
}

export function on<T = void>(action: Action<T>) {
  const key = action.getKey();
  const subject = actionManager.get(key);

  return subject.asObservable() as Observable<T>;
}
