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
    it('allow that callback is async', done => {
      let called = false;
      const state = atom('hello', undefined, async state => {
        called = true;
        state.set(state.value + ' world');
      });
      state.subscribe(value => {
        if (!called) return;

        expect(called).toBe(true);
        expect(value).toBe('hello world');
        done();
      });
    });
  });

  describe('basic test', () => {
    it('when no default value, subscribe fn is not called', () => {
      const state = atom<number>();
      const mockFn = jest.fn();
      state.subscribe(mockFn);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('when default value, subscribe fn is called', () => {
      const state = atom(1);
      const mockFn = jest.fn();
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
  });
});
