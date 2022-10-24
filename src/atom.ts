import { Subject, Observable, startWith, switchMap, ReplaySubject } from 'rxjs';
import { getDefaultLabel, logForAtom } from './logger';

export type Atom<T = void> = {
  $: Observable<T>;
  readonly value: T;
  set: (value: T) => void;
  update: (updater: (prev: T) => T) => void;
  reset: () => void;
  complete: () => void;
  subscribe: (subscriber?: Subscriber<T>) => UnSubscriber;
};

type Callback = () => void | CleanupFn | Promise<void | CleanupFn>;
type CleanupFn = () => void | Promise<void>;
type Subscriber<T> = (value: T) => void;
type UnSubscriber = () => void;

export function createAtom<T = void>(initValue?: T, debugLabel?: string, callback?: Callback): Atom<T> {
  const _factory = () => new ReplaySubject<T>(1);
  const _resetter = new Subject<number>();
  const _source = new Subject<T>();
  const _debugLabel = debugLabel || getDefaultLabel();
  const _observable = _resetter.asObservable().pipe(
    startWith(null),
    switchMap(() => _destination),
  );

  let _destination = _factory();
  let _subscription = _source.subscribe(_destination);
  let _value: T;

  const _init = () => {
    if (initValue !== undefined) {
      _set(initValue);
    }
    if (callback) {
      Promise.resolve().then(() => {
        Promise.resolve(callback()).then(cleanup => {
          _subscription.add(() => {
            cleanup?.();
          });
        });
      });
    }
  };
  const _set = (value: T) => {
    if (_value === value) return;

    logForAtom(_debugLabel, _value, value);

    _value = value;
    _source.next(value);
  };

  _init();

  return {
    get $() {
      return _observable;
    },

    get value() {
      return _value;
    },

    set: value => {
      _set(value);
    },

    update: updater => {
      _set(updater(_value));
    },

    reset: () => {
      _subscription.unsubscribe();
      _destination = _factory();
      _subscription = _source.subscribe(_destination);

      // @note: update for $
      _resetter.next(Date.now());

      // @note: initiate value as undefined
      _value = undefined as unknown as T;

      // @note: call init fn again
      _init();
    },

    complete: () => {
      _subscription.unsubscribe();
    },

    subscribe: subscriber => {
      const subscription = _observable.subscribe(value => subscriber?.(value));
      return () => subscription.unsubscribe();
    },
  };
}
