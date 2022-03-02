import { State } from './state';

export type RxState<T> = State<T>;

export const atom = <T>(initValue: T, debugLabel?: string, callback?: (state: RxState<T>) => void) => {
  const state = new State(initValue, debugLabel);
  if (callback) Promise.resolve().then(callback.bind(this, state));
  return state;
};
