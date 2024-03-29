import { describe, it, expect, vi } from 'vitest';
import { atom } from '../src';

describe('state test', () => {
  describe('basic test', () => {
    it('when no default value, subscribe fn is not called', () => {
      const state = atom<number>();
      const mockFn = vi.fn();
      state.subscribe(mockFn);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('when default value, subscribe fn is called', () => {
      const state = atom(1);
      const mockFn = vi.fn();
      state.subscribe(mockFn);
      expect(mockFn).toHaveBeenCalled();
    });

    it('has value from next line', () => {
      const state = atom(1);
      expect(state.value).toBe(1);
    });

    it('null can be initial value', () => {
      const state = atom(null);
      expect(state.value).toBe(null);
    });

    it('cannot use next method', () => {
      const state = atom(1);
      // @ts-ignore
      state.next(2);
      expect(state.value).toBe(1);
    });
  });

  describe('update test', () => {
    it('when primitive type, update fn works', () => {
      const state = atom(0);

      state.update(v => v + 1);

      expect(state.value).toBe(1);
    });

    it('when object, update fn works', () => {
      const state = atom({ hello: 'world' });

      state.update(v => ({ ...v, hello: 'update' }));

      expect(state.value).toEqual({ hello: 'update' });
    });
  });

  describe('callback test', () => {
    it('allow that callback is async', () =>
      new Promise<void>(done => {
        let called = false;
        const state = atom('hello', undefined, state => {
          called = true;
          state.set(`${state.value} world`);
        });
        state.subscribe(value => {
          if (!called) return;

          expect(called).toBe(true);
          expect(value).toBe('hello world');
          done();
        });
      }));

    it('will call cleanup fn, when the state is completed', () =>
      new Promise<void>(done => {
        const state = atom('hello', undefined, () => {
          return () => {
            done();
          };
        });
        state.complete();
      }));
  });

  describe('override test', () => {
    it('prev state is completed, when key duplicated', () =>
      new Promise<void>(done => {
        const key = 'state';
        const state = atom('hello', key);
        state.subscribe({
          complete: () => {
            done();
          },
        });
        atom('world', key);
      }));
  });
});
