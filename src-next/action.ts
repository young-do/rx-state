import { Observable, Subject } from 'rxjs';

export type Action<T = void> = {
  $: Observable<T>;
  dispatch: (payload: T) => void;
};

export function createAction<T = void>(): Action<T> {
  const subject = new Subject<T>();

  return {
    get $() {
      return subject.asObservable();
    },
    dispatch: (payload: T) => {
      return subject.next(payload);
    },
  };
}
