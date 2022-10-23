import { Observable, Subject } from 'rxjs';
import { getDefaultLabel, logging } from './logger';

export type Action<T = void> = {
  $: Observable<T>;
  dispatch: (payload: T) => void;
};

export function createAction<T = void>(debugLabel?: string): Action<T> {
  const subject = new Subject<T>();
  const _debugLabel = debugLabel || getDefaultLabel();

  subject.subscribe(logging('action', _debugLabel));

  return {
    get $() {
      return subject.asObservable();
    },
    dispatch: (payload: T) => {
      return subject.next(payload);
    },
  };
}
