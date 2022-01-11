import type { RxState } from './state';
import { atom } from './state';
import { safe_not_equal, __array_unique } from './utils';

export const createTree = () => {
  const tree = new Tree();
  return tree;
};

class Tree {
  rootValue = Object.create(null);
  stateMap = Object.create(null);

  query<T>(path: string, defaultValue?: T | undefined): RxState<T | undefined> {
    path = '/' + path.split('/').filter(Boolean).join('/');

    if (path && this.stateMap[path]) {
      return this.stateMap[path];
    }

    const initialValue: T | undefined = getValue(this.rootValue, path, defaultValue);
    const state = atom<T | undefined>(initialValue);

    state.set = value => {
      // 변경사항 전파
      if (safe_not_equal(state.value, value)) {
        // 값 저장
        setValue(this.rootValue, path, value);
        state.next(value);

        const broadcast_paths: string[] = [];

        // 이벤트 전파 path 확인 (downcast)
        Object.keys(this.stateMap)
          .filter(p => p !== path && p.startsWith(path))
          .filter(Boolean)
          .forEach(path => {
            broadcast_paths.push(path);
          });

        // 이벤트 전파 path 확인 (upcast)
        path.split('/').forEach((_, index, A) => {
          const subPath = A.slice(0, A.length - index - 1).join('/');
          if (subPath) {
            broadcast_paths.push(subPath);
          }
        });

        // 이벤트 전파
        if (broadcast_paths.length === 0) {
          Promise.resolve().then(() => {
            const update_broadcast_paths = __array_unique(broadcast_paths);
            update_broadcast_paths.forEach(path =>
              notify(this.stateMap, path, getValue(this.rootValue, path, state.value)),
            );
          });
        }
      }
    };

    return (this.stateMap[path] = state);
  }

  reset() {
    this.rootValue = Object.create(null);
    this.stateMap = Object.create(null);
  }
}

function getValue<T>(object: any, path: string, defaultValue: T): T | undefined {
  const paths = path.split('/').filter(Boolean);
  let nested = object;

  paths.every(key => (nested = nested[key]));
  return nested === undefined ? defaultValue : nested;
}

function setValue<T>(object: any, path: string, value: T) {
  const paths = path.split('/').filter(Boolean);
  const lastIndex = paths.length - 1;

  let nested = object;
  paths.forEach((path, index) => {
    if (index !== lastIndex) {
      nested[path] = nested[path] ?? Object.create(null);
    } else {
      nested[path] = typeof value === 'object' ? { ...nested[path], ...value } : value;
    }
    nested = nested[path];
  });
}

function notify(stateMap: any, path: string, value: any) {
  const state = stateMap[path];
  if (state && safe_not_equal(state.value, value)) {
    state.next(value);
  }
}
