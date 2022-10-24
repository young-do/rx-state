import { describe, expect, it } from 'vitest';
import { createAction } from '../action';

describe('action test', () => {
  describe('when payload is void', () => {
    it('works, when action without call', () =>
      new Promise<void>(done => {
        const action = createAction();
        action.$.subscribe(payload => {
          expect(payload).toBeUndefined();
          done();
        });
        action();
      }));

    it('works, when action payload is undefined', () =>
      new Promise<void>(done => {
        const action = createAction();
        action.$.subscribe(payload => {
          expect(payload).toBeUndefined();
          done();
        });
        action(undefined);
      }));
  });

  describe('when payload is object', () => {
    it('works, when action without call', () =>
      new Promise<void>(done => {
        const action = createAction<object>();
        const payload = {};
        action.$.subscribe(received => {
          expect(payload).toBe(received);
          done();
        });
        action(payload);
      }));

    it('works, when dispatch action tuple', () =>
      new Promise<void>(done => {
        const action = createAction<object>();
        const payload = {};
        action.$.subscribe(received => {
          expect(payload).toBe(received);
          done();
        });
        action(payload);
      }));
  });

  describe('when action is multiply subscribed', () => {
    it('works, when other subscription is unsubscribed', () =>
      new Promise<void>(done => {
        const action = createAction<number>();
        const s1 = action.$.subscribe();

        // dispatch 1
        action(1);
        // unsubscribe s1
        s1.unsubscribe();

        expect(s1.closed).toBe(true);

        const s2 = action.$.subscribe(payload => {
          expect(payload).toBe(2);
          done();
        });

        // dispatch 2
        action(2);
        expect(s2.closed).toBe(false);
      }));
  });
});
