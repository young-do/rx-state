import { ReplaySubject } from 'rxjs';
import { createLabelerWithCount } from './utils/generate-label';
import { logForAtom } from './utils/logger';

const getDefaultLabel = createLabelerWithCount('unnamed_state');

export class State<T, R = T> extends ReplaySubject<T> {
  private _debugLabel: string;
  public value!: T;

  constructor(initValue?: T, _debugLabel?: string, _path?: string, _rootState?: State<R>) {
    // @note: for behavior subject with no default value
    super(1);

    this._debugLabel = _debugLabel || getDefaultLabel();

    // @note: 'null' can be initial value, but 'undefined' not.
    if (initValue !== undefined) {
      this.set(initValue as T);
    }
  }

  set = (nextValue: T): void => {
    if (this.value !== nextValue) {
      logForAtom(this._debugLabel, this.value, nextValue);
      this.value = nextValue;
      return this.next(nextValue);
    }
  };

  update = (updater: (prev: T) => T) => {
    this.set(updater(this.value));
  };
}
