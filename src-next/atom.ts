import { Subject, Observable, startWith, switchMap, ReplaySubject } from 'rxjs';

export type Atom<T = void> = {
  $: Observable<T>;
  value: T;
  set: (value: T) => void;
  update: (updater: (prev: T) => T) => void;
  reset: () => void;
  complete: () => void;
};

export function createAtom<T = void>(initValue?: T, callback?: () => void | Function): Atom<T> {
  const _factory = () => new ReplaySubject<T>(1);
  const _resetter = new Subject<number>();
  const _source = new Subject<T>();

  let _destination = _factory();
  let _subscription = _source.subscribe(_destination);
  let _value: T;

  const _init = () => {
    if (initValue !== undefined) {
      _set(initValue);
    }
    if (callback) {
      Promise.resolve().then(() => {
        const cleanup = callback();
        _source.subscribe({ complete: () => cleanup?.() });
      });
    }
  };
  const _set = (value: T) => {
    if (_value === value) return;
    _value = value;
    _source.next(value);
  };

  _init();

  return {
    get $() {
      return _resetter.asObservable().pipe(
        startWith(null),
        switchMap(() => _destination),
      );
    },
    get value() {
      return _value;
    },
    set: (value: T) => {
      _set(value);
    },
    update: (updater: (prev: T) => T) => {
      _set(updater(_value));
    },
    reset: () => {
      _subscription.unsubscribe();
      _destination = _factory();
      _subscription = _source.subscribe(_destination);
      _resetter.next(Date.now());
      _init();
    },
    complete: () => {
      _source.complete();
    },
  };
}
