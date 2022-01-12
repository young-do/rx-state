import { atom } from '../src';
import { mergeValue } from '../src/state';

describe('state test', () => {
  describe('merge function test', () => {
    it('same depth - case 1', () => {
      const origin = { a: 1 };
      const next = mergeValue(origin, '/a', 2);
      expect(origin).toEqual({ a: 1 });
      expect(next).toEqual({ a: 2 });
    });
    it('same depth - case 2', () => {
      const origin = { a: 1 };
      const next = mergeValue(origin, '/b', 1);
      expect(origin).toEqual({ a: 1 });
      expect(next).toEqual({ a: 1, b: 1 });
    });
    it('deeper', () => {
      const origin = { a: 1 };
      const next = mergeValue(origin, '/a/b/c', 1);
      expect(origin).toEqual({ a: 1 });
      expect(next).toEqual({ a: { b: { c: 1 } } });
    });
    it('swallower - case 1', () => {
      const origin = { a: { a: 1 } };
      const next = mergeValue(origin, '/a', 1);
      expect(origin).toEqual({ a: { a: 1 } });
      expect(next).toEqual({ a: 1 });
    });
    it('swallower - case 2', () => {
      const origin = { a: { a: 1 } };
      const next = mergeValue(origin, '/b', 1);
      expect(origin).toEqual({ a: { a: 1 } });
      expect(next).toEqual({ a: { a: 1 }, b: 1 });
    });
    it('set on root', () => {
      const origin = { a: 1 };
      const next = mergeValue(origin, '/', { b: 1 });
      expect(origin).toEqual({ a: 1 });
      expect(next).toEqual({ b: 1 });
    });
    it('[error case] when primitive type', () => {
      const origin = 'hello world';
      expect(() => mergeValue(origin, '/a', 2)).toThrowError();
    });
  });

  describe('partial test', () => {
    it('when primitive type', () => {
      const state = atom(0);
      const p1 = state.partial('/');
      const p2 = state.partial('/hello/world');

      expect(state.value).toBe(0);
      expect(p1.value).toBe(state.value);
      expect(p2.value).toBeUndefined();
    });

    it('when object', () => {
      const state = atom<object>({ hello: { world: 'it works!' } });
      const p1 = state.partial('/');
      const p2 = state.partial('/hello/world');
      const p3 = state.partial('/hello/wow');

      expect(state.value).toEqual({ hello: { world: 'it works!' } });
      expect(p1.value).toEqual(state.value);
      expect(p2.value).toBe('it works!');
      expect(p3.value).toBeUndefined();

      state.set({ hello: { wow: 'it works!' } });

      expect(state.value).toEqual({ hello: { wow: 'it works!' } });
      expect(p1.value).toEqual(state.value);
      expect(p2.value).toBeUndefined();
      expect(p3.value).toBe('it works!');

      p3.set('amazing!');

      expect(state.value).toEqual({ hello: { wow: 'amazing!' } });
      expect(p1.value).toEqual(state.value);
      expect(p2.value).toBeUndefined();
      expect(p3.value).toBe('amazing!');
    });
  });
});
