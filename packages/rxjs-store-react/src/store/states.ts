import { on, reducer } from 'rxjs-store-core';
import { Increase, Decrease } from './actions';

export const count$ = reducer(0, undefined, () => {
  on(Increase).subscribe(() => count$.set(count$.value + 1));
  on(Decrease).subscribe(() => count$.set(count$.value - 1));
});
