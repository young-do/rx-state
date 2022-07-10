import { Observable, Subject } from 'rxjs';
import { createLabelerWithCount } from './utils/generate-label';
import { generateKey } from './utils/gerenate-key';
import { logForAction } from './utils/logger';

export type Action<T = void> = {
  (payload: T): ActionPayload<T>;
  toString: () => string;
  debugLabel: string;
};
export type ActionPayload<T> = [key: string, debugLabel: string, payload: T];

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

export const createAction = <T = void>(debugLabel?: string) => {
  const key = `#${generateKey()}`;
  actionManager.set(key);

  const action: Action<T> = (payload: T) => [key, action.debugLabel, payload];
  action.toString = () => key;
  action.debugLabel = debugLabel || getDefaultLabel();

  return action;
};

export const dispatch = <T = void>(actionPayload: ActionPayload<T>) => {
  const [key, debugLabel, payload] = actionPayload;
  const subject = actionManager.get(key);

  logForAction(debugLabel, payload);

  subject.next(payload);
};

export const on = <T = void>(action: Action<T>) => {
  const key = action.toString();
  const subject = actionManager.get(key);

  return subject.asObservable() as Observable<T>;
};
