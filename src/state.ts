import { ReplaySubject } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';
import { logForAtom } from './logger';

export class State<T, R = T> extends ReplaySubject<T> {
  private _rootState?: State<R>;
  private _path?: string;
  private _memo = Object.create(null);
  private _debugLabel: string;
  public value!: T;

  constructor(initValue?: T, _debugLabel?: string, _path?: string, _rootState?: State<R>) {
    // @note: for behavior subject with no default value
    super(1);
    this._debugLabel = _debugLabel || getDefaultLabel();
    this._path = _path;
    this._rootState = _rootState;

    if (initValue != null) {
      this.set(initValue);
    }

    if (_path && _rootState) {
      // syncing
      _rootState.subscribe(rootValue => {
        const nestedValue = getValue<T>(rootValue, _path) as T;
        logForAtom(this._debugLabel, this.value, nestedValue);

        // @note: set을 호출하면 loop에 빠지므로 next 호출.
        this.value = nestedValue;
        this.next(nestedValue);
      });
    }
  }

  set = (nextValue: T): void => {
    if (this._rootState && this._path) {
      // upcast
      const merged = mergeValue(this._rootState.value, this._path, nextValue);
      return this._rootState.set(merged);
    }
    if (this.value !== nextValue) {
      logForAtom(this._debugLabel, this.value, nextValue);
      this.value = nextValue;
      return this.next(nextValue);
    }
  };

  update = (updater: (prev: T) => T) => {
    this.set(updater(this.value));
  };

  partial = <P>(_path: string): State<P> => {
    if (this._memo[_path]) return this._memo[_path];

    const partialValue = getValue<P>(this.value, _path) as P;
    const partialState = new State<P, T>(partialValue, `${this._debugLabel}${this._path}`, _path, this);

    return (this._memo[_path] = partialState);
  };
}

export function getValue<T>(object: any, _path: string): T | undefined {
  const _paths = _path.split('/').filter(Boolean);
  let nested = object;

  _paths.every(key => (nested = nested[key]));
  return nested;
}

export function mergeValue<T>(object: any, _path: string, value: T): any {
  const _paths = _path.split('/').filter(Boolean);
  const lastIndex = _paths.length - 1;

  if (_paths.length === 0) {
    return typeof value === 'object' ? { ...value } : value;
  }

  const cloned = cloneDeep(object);
  let nested = cloned;
  _paths.forEach((_path, index) => {
    if (typeof nested[_path] !== 'object') {
      nested[_path] = Object.create(null);
    }
    if (index === lastIndex) {
      nested[_path] = typeof value === 'object' ? { ...nested[_path], ...value } : value;
    }
    nested = nested[_path];
  });
  return cloned;
}

let index = 0;
const getDefaultLabel = () => `#${index++}_unnamed_state`;
