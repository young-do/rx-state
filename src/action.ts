import { Observable, Subject } from 'rxjs';
import { getDefaultLabel, logForAction } from './logger';

export type Action<T = void> = {
  (payload: T): void;
  readonly $: Observable<T>;
};

export function createAction<T = void>(debugLabel?: string): Action<T> {
  const subject = new Subject<T>();
  const _debugLabel = debugLabel || getDefaultLabel();

  return Object.assign(
    (payload: T) => {
      logForAction(_debugLabel, payload);
      subject.next(payload);
    },
    {
      get $() {
        return subject.asObservable();
      },
    },
  );
}
