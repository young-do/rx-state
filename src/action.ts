import { Observable, Subject } from 'rxjs';
import { nanoid } from 'nanoid';

type Action<T = void> = {
  (payload: T): [string, T];
  toString: () => string;
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

export const createAction = <T = void>() => {
  const key = `#${nanoid()}`;
  actionManager.set(key);

  const action: Action<T> = (payload: T) => [key, payload];
  action.toString = () => key;

  return action;
};

export const dispatch = <T = void>(actionOrTuple: Action<T> | [string, T], payload?: T) => {
  const isFunction = typeof actionOrTuple === 'function';
  const key = isFunction ? actionOrTuple.toString() : actionOrTuple[0];
  const subject = actionManager.get(key);

  subject.next(isFunction ? payload : actionOrTuple[1]);
};

export const on = <T = void>(action: Action<T>) => {
  const key = action.toString();
  const subject = actionManager.get(key);

  return subject.asObservable() as Observable<T>;
};
