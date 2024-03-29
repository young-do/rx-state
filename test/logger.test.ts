import { beforeAll, describe, expect, it, vi } from 'vitest';
import { setLogLevel, logSnapshot } from '../src';
import { logForAtom, logForAction } from '../src/utils/logger';

describe('logger test', () => {
  describe('when log level is none', () => {
    beforeAll(() => {
      setLogLevel('none');
    });

    it('console.log is not called, whenever or not label starts with #', () => {
      const log = vi.fn();
      console.log = log;

      logForAction('test', null);
      expect(log).not.toBeCalled();

      logForAction('#test', null);
      expect(log).not.toBeCalled();

      logForAtom('test', null);
      expect(log).not.toBeCalled();

      logForAtom('#test', null);
      expect(log).not.toBeCalled();
    });

    it('snapshot is printed', () => {
      console.log = vi.fn();
      logSnapshot();
      expect(console.log).toBeCalled();
    });
  });

  describe('when log level is named', () => {
    beforeAll(() => {
      setLogLevel('named');
    });

    it('console.log is not called, when label starts with #', () => {
      console.log = vi.fn();

      logForAction('#test', null);
      expect(console.log).not.toBeCalled();

      logForAtom('#test', null);
      expect(console.log).not.toBeCalled();
    });

    it('console.log is called, when label does not start with #', () => {
      console.log = vi.fn();
      logForAction('test', null);
      expect(console.log).toBeCalled();

      console.log = vi.fn();
      logForAtom('test', null);
      expect(console.log).toBeCalled();
    });

    it('console.log is called', () => {
      console.log = vi.fn();
      logSnapshot();
      expect(console.log).toBeCalled();
    });
  });

  describe('when log level is all', () => {
    beforeAll(() => {
      setLogLevel('all');
    });

    it('console.log is called, whenever or not label starts with #', () => {
      console.log = vi.fn();
      logForAction('test', null);
      expect(console.log).toBeCalled();

      console.log = vi.fn();
      logForAction('#test', null);
      expect(console.log).toBeCalled();

      console.log = vi.fn();
      logForAtom('test', null);
      expect(console.log).toBeCalled();

      console.log = vi.fn();
      logForAtom('#test', null);
      expect(console.log).toBeCalled();
    });

    it('console.log is called', () => {
      console.log = vi.fn();
      logSnapshot();
      expect(console.log).toBeCalled();
    });
  });
});
