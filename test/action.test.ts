import { describe, expect, it } from 'vitest';
import { createAction, dispatch, on } from '../src';

describe('action test', () => {
  describe('when payload is void', () => {
    it('works, when action without call', () =>
      new Promise<void>(done => {
        const action = createAction();
        on(action).subscribe(payload => {
          expect(payload).toBeUndefined();
          done();
        });
        dispatch(action);
      }));

    it('works, when action payload is undefined', () =>
      new Promise<void>(done => {
        const action = createAction();
        on(action).subscribe(payload => {
          expect(payload).toBeUndefined();
          done();
        });
        dispatch(action, undefined);
      }));

    it('works, when dispatch action tuple', () =>
      new Promise<void>(done => {
        const action = createAction();
        on(action).subscribe(payload => {
          expect(payload).toBeUndefined();
          done();
        });
        dispatch(action());
      }));
  });

  describe('when payload is object', () => {
    it('works, when action without call', () =>
      new Promise<void>(done => {
        const action = createAction<object>();
        const payload = {};
        on(action).subscribe(received => {
          expect(payload).toBe(received);
          done();
        });
        dispatch(action, payload);
      }));

    it('works, when dispatch action tuple', () =>
      new Promise<void>(done => {
        const action = createAction<object>();
        const payload = {};
        on(action).subscribe(received => {
          expect(payload).toBe(received);
          done();
        });
        dispatch(action(payload));
      }));
  });
});
