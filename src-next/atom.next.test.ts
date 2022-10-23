import { describe, expect, it, vi } from 'vitest';
import { createAtom } from './atom';

describe('atom test', () => {
  describe('basic test', () => {
    it('when no default value, subscribe fn is not called', () => {
      const atom = createAtom<number>();
      const mockFn = vi.fn();
      atom.$.subscribe(mockFn);
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('when default value, subscribe fn is called', () => {
      const atom = createAtom(1);
      const mockFn = vi.fn();
      atom.$.subscribe(mockFn);
      expect(mockFn).toHaveBeenCalled();
    });

    it('when default value, the value must be passed to subscribe fn ', () =>
      new Promise<void>(done => {
        const atom = createAtom(1);
        atom.$.subscribe(value => {
          expect(value).toBe(1);
          done();
        });
      }));

    it('has value from next line', () => {
      const atom = createAtom(1);
      expect(atom.value).toBe(1);
    });

    it('null can be initial value', () => {
      const atom = createAtom(null);
      expect(atom.value).toBe(null);
    });
  });

  describe('update test', () => {
    it('when primitive type, update fn works', () => {
      const atom = createAtom(0);

      atom.update(prev => prev + 1);

      expect(atom.value).toBe(1);
    });

    it('when object, update fn works', () => {
      const atom = createAtom({ hello: 'world' });

      atom.update(prev => ({ ...prev, hello: 'update' }));

      expect(atom.value).toEqual({ hello: 'update' });
    });
  });

  describe('callback test', () => {
    it('allow that callback is async', () =>
      new Promise<void>(done => {
        let called = false;
        const atom = createAtom('hello', () => {
          called = true;
          atom.set(`${atom.value} world`);
        });
        atom.$.subscribe(value => {
          if (!called) return;

          expect(called).toBe(true);
          expect(value).toBe('hello world');
          done();
        });
      }));

    it('will call cleanup fn, when the atom is completed', () =>
      new Promise<void>(done => {
        const atom = createAtom('hello', () => {
          return () => {
            done();
          };
        });
        atom.complete();
      }));
  });
});
