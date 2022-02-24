import { Observable, Subject } from 'rxjs';
import { nanoid } from 'nanoid';
import { logForAction } from './logger';

export type Action<T = void> = {
  (payload: T): [string, string, T];
  toString: () => string;
  debugLabel: string;
};

const actionManager = {
  map: Object.create(null) as Record<string, Subject<unknown>>,
  get(key: string) {
    const subject = this.map[key];
    if (!subject) throw new Error(`Internal Error: Action ${key} has not been declared yet.`);
    return subject;
  },
  set(key: string) {
    const subject = new Subject();
    if (this.map[key]) throw new Error(`Internal Error: Action ${key} already exists.`);
    return (this.map[key] = subject);
  },
};

export const createAction = <T = void>(debugLabel?: string) => {
  const key = `#${nanoid()}`;
  actionManager.set(key);

  const action: Action<T> = (payload: T) => [key, action.debugLabel, payload];
  action.toString = () => key;
  action.debugLabel = debugLabel || getDefaultLabel();

  return action;
};

export const dispatch = <T = void>(actionOrTuple: Action<T> | [string, string, T], payload?: T) => {
  const isAction = typeof actionOrTuple === 'function';

  const key = isAction ? actionOrTuple.toString() : actionOrTuple[0];
  const subject = actionManager.get(key);
  const debugLabel = isAction ? actionOrTuple.debugLabel : actionOrTuple[1];
  payload = isAction ? payload : actionOrTuple[2];

  logForAction(debugLabel, payload);

  subject.next(payload);
};

export const on = <T = void>(action: Action<T>) => {
  const key = action.toString();
  const subject = actionManager.get(key);

  return subject.asObservable() as Observable<T>;
};

let index = 0;
const getDefaultLabel = () => `#${index++}_unnamed_action`;
