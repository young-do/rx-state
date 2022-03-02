import { Observable } from 'rxjs';
import { State } from './state';

export type RxState<T> = State<T>;

export const atom = <T>(initValue: T, debugLabel?: string) => {
  const state = new State(initValue);
  if (debugLabel != null) state.debugLabel = debugLabel;
  return state;
};
