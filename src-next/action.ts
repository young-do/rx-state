import { Observable, Subject } from 'rxjs';
import { logging } from './logger';

export type Action<T = void> = {
  $: Observable<T>;
  dispatch: (payload: T) => void;
};

export function createAction<T = void>(debugLabel?: string): Action<T> {
  const subject = new Subject<T>();
  subject.subscribe(logging('action', debugLabel));
  return {
    get $() {
      return subject.asObservable();
    },
    dispatch: (payload: T) => {
      return subject.next(payload);
    },
  };
}
