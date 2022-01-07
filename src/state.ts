import { BehaviorSubject, Observable } from 'rxjs';

class State<T> extends BehaviorSubject<T> {
  constructor(value: T) {
    super(value);
  }
  set(nextValue: T): void {
    this.next(nextValue);
  }
}

export type RxState<T> = State<T>;

export const atom = <T>(initValue: T, reducerCallback?: (state: RxState<T>) => void) => {
  const state = new State(initValue);
  reducerCallback?.(state);
  return state;
};

export const selector = <S, T>(state: RxState<T>, select: (value: T) => S) => {
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
