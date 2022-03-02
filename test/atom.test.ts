import { atom } from '../src/atom';

describe('atom test', () => {
  test('basic test', () => {
    const state = atom('hello world');
    expect(state.value).toBe('hello world');
  });
});
