import { State } from './state';
import { logWarn } from './utils/logger';

export type RxState<T> = State<T>;
export type RxStateCallback<T> = (state: RxState<T>) => void | Promise<void> | RxStateCleanup | Promise<RxStateCleanup>;
export type RxStateCleanup = () => void;

const stateMap = new Map<string, RxState<unknown>>();

export function atom<T>(initValue?: T, debugLabel?: string, callback?: RxStateCallback<T>) {
  if (debugLabel && stateMap.has(debugLabel)) {
    stateMap.get(debugLabel)?.complete();
    stateMap.delete(debugLabel);
    logWarn(debugLabel, `Atom ${debugLabel} already existed, so previous one is completed.`);
  }
  const state = new State<T>(initValue, debugLabel);
  Promise.resolve().then(() => {
    Promise.resolve(callback?.(state)).then(cleanup => {
      if (cleanup && typeof cleanup === 'function') {
        state.subscribe({ complete: cleanup });
      }
    });
  });
  stateMap.set(state._debugLabel, state as RxState<unknown>);
  return state;
}
