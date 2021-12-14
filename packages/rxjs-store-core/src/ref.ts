import { BehaviorSubject, Observable } from 'rxjs';

class Ref<T> extends BehaviorSubject<T> {
  set = this.next;
  constructor(value?: T) {
    super(value as T);
  }
}
export const ref = <T>(initValue?: T) => {
  return new Ref(initValue);
};

export const reducer = <T>(initValue: T | undefined, callback: (ref: Ref<T>) => void): Ref<T> => {
  const _ref = ref(initValue);
  callback(_ref);
  return _ref;
};

export const selector = <S, T>(ref: Ref<T>, select: (value: T) => S) => {
  return new Observable<S>(subscriber => {
    ref.subscribe({
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
