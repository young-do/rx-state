import { createEffector } from '../src/effector';

describe('effector function', () => {
  it('default', () => {
    const flag = 'hello world';
    const effector = createEffector(flag);
    let called;
    let receivedFlag;

    effector.register(_flag => {
      called = true;
      receivedFlag = _flag;
    });
    expect(called).toBeUndefined();

    effector.run();
    expect(called).toBe(true);
    expect(receivedFlag).toBe(flag);
  });
});
