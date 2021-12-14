import { BehaviorSubject, Observable } from 'rxjs';

class State<T> extends BehaviorSubject<T> {
  set = this.next;
  constructor(value?: T) {
    super(value as T);
  }
}
export const state = <T>(initValue?: T) => {
  return new State(initValue);
};

export const reducer = <T>(initValue: T | undefined, callback: (state: State<T>) => void): State<T> => {
  const _state = state(initValue);
  callback(_state);
  return _state;
};

export const selector = <S, T>(state: State<T>, select: (value: T) => S) => {
  return new Observable<S>(subscriber => {
    state.subscribe({
      next(value) {
        subscriber.next(select(value));
      },
      error(err) {
        subscriber.error(err);
      },
      complete() {
        subscriber.complete();
      },
    });
  });
};
