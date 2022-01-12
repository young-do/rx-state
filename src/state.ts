import { BehaviorSubject } from 'rxjs';
import cloneDeep from 'lodash.clonedeep';

export class State<T, R = T> extends BehaviorSubject<T> {
  #rootState?: State<R>;
  #path?: string;
  #memo = Object.create(null);

  constructor(value: T, path?: string, rootState?: State<R>) {
    super(value);
    this.#path = path;
    this.#rootState = rootState;

    if (path && rootState) {
      // syncing
      rootState.subscribe(rootValue => {
        const nestedValue = getValue<T>(rootValue, path);
        // @note: set을 호출하면 loop에 빠지므로 next 호출.
        this.next(nestedValue as T);
      });
    }
  }

  set(nextValue: T): void {
    if (this.#rootState && this.#path) {
      // upcast
      const merged = mergeValue(this.#rootState.value, this.#path, nextValue);
      this.#rootState.set(merged);
    } else {
      this.next(nextValue);
    }
  }

  partial<P>(path: string): State<P> {
    if (this.#memo[path]) return this.#memo[path];

    const partialValue = getValue<P>(this.value, path) as P;
    const partialState = new State<P, T>(partialValue, path, this);

    return (this.#memo[path] = partialState);
  }
}

export function getValue<T>(object: any, path: string): T | undefined {
  const paths = path.split('/').filter(Boolean);
  let nested = object;

  paths.every(key => (nested = nested[key]));
  return nested;
}

export function mergeValue<T>(object: any, path: string, value: T): any {
  const paths = path.split('/').filter(Boolean);
  const lastIndex = paths.length - 1;

  if (paths.length === 0) {
    return typeof value === 'object' ? { ...value } : value;
  }

  const cloned = cloneDeep(object);
  let nested = cloned;
  paths.forEach((path, index) => {
    if (typeof nested[path] !== 'object') {
      nested[path] = Object.create(null);
    }
    if (index === lastIndex) {
      nested[path] = typeof value === 'object' ? { ...nested[path], ...value } : value;
    }
    nested = nested[path];
  });
  return cloned;
}
