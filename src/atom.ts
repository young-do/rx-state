import { State } from './state';

export type RxState<T> = State<T>;
export type RxStateCallback<T> = (state: RxState<T>) => void | RxStateCleanup;
export type RxStateCleanup = () => void;

export const atom = <T>(initValue?: T, debugLabel?: string, callback?: RxStateCallback<T>) => {
  const state = new State<T>(initValue, debugLabel);
  Promise.resolve().then(() => {
    const cleanup = callback?.(state)?.bind(this);
    cleanup && state.subscribe({ complete: cleanup });
  });
  return state;
};
