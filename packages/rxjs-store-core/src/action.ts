import { Observable, Subject } from 'rxjs';

type Action<T = void> = {
  (payload: T): [string, T];
  toString: () => string;
};

const actionManager = {
  map: {} as Record<string, Subject<any>>,
  get(name: string) {
    const subject = this.map[name];
    if (!subject) throw new Error(`Action ${name} has not been declared yet.`);
    return subject;
  },
  set(name: string) {
    const subject = new Subject();
    if (this.map[name]) console.warn(`Action ${name} already exists.`);
    return (this.map[name] = subject);
  },
};

export const createAction = <T = void>(name: string) => {
  actionManager.set(name);
  const action: Action<T> = (payload: T) => [name, payload];
  action.toString = () => name;
  return action;
};

export const dispatch = <T = void>(actionOrTuple: Action<T> | [string, T], payload?: T) => {
  const _name = typeof actionOrTuple === 'function' ? actionOrTuple.toString() : actionOrTuple[0];
  const _payload = typeof actionOrTuple === 'function' ? payload : actionOrTuple[1];
  const subject = actionManager.get(_name);
  subject.next(_payload);
};

export const on = <T = void>(action: Action<T>) => {
  const name = action.toString();
  const subject = actionManager.get(name);
  return subject.asObservable() as Observable<T>;
};
