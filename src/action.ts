import { Observable, Subject } from 'rxjs';
import { getDefaultLabel, logForAction } from './logger';

export type Action<T = void> = {
  (payload: T): void;
  readonly $: Observable<T>;
};

export function createAction<T = void>(debugLabel?: string): Action<T> {
  const subject = new Subject<T>();
  const _debugLabel = debugLabel || getDefaultLabel();

  subject.subscribe(payload => logForAction(_debugLabel, payload));

  return Object.assign((payload: T) => subject.next(payload), {
    get $() {
      return subject.asObservable();
    },
  });
}
