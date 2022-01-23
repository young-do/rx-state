import { dispatch, on, createAction } from './action';
import type { Action } from './action';

export const createEffector = <T>(flag?: T) => {
  return new Effector(flag);
};

class Effector<T> {
  action: Action<T>;

  constructor(private flag?: T) {
    this.action = createAction<T>();
    if (flag !== undefined) this.run(flag);
  }

  register(callback: (flag: T) => any) {
    on(this.action).subscribe(callback);
  }

  run(flag?: T) {
    if (flag !== undefined) this.flag = flag;
    dispatch(this.action, this.flag);
  }
}
