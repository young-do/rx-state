import { BehaviorSubject, Observable } from 'rxjs';

class State<T> extends BehaviorSubject<T> {
  constructor(value: T, private name?: string) {
    super(value);
  }
  set(nextValue: T): void {
    if (this.name) {
      const prevValue = this.value;
      console.log(this.name, prevValue, '->', nextValue);
    }
    this.next(nextValue);
  }
}
export const state = <T>(initValue: T, name?: string) => {
  return new State(initValue, name);
};

export const reducer = <T>(initValue: T, name: string | undefined, callback: (state: State<T>) => void): State<T> => {
  const _state = state(initValue, name);
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
