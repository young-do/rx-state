import { ReplaySubject } from 'rxjs';
import { createLabelerWithCount } from './utils/generate-label';
import { logForAtom } from './utils/logger';

const getDefaultLabel = createLabelerWithCount('unnamed_state');

export class State<T> extends ReplaySubject<T> {
  public value!: T;
  private _debugLabel: string;
  private _next: (value: T) => void;

  constructor(initValue?: T, _debugLabel?: string) {
    // @note: for behavior subject with no default value
    super(1);

    this._next = super.next;
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
      return this._next(nextValue);
    }
  };

  update = (updater: (prev: T) => T) => {
    this.set(updater(this.value));
  };

  /**
   * cannot call original 'next' method
   */
  next = () => {};
}
