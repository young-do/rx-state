import { zip } from 'rxjs';
import { atom, selector } from '../src/atom';

describe('atom test', () => {
  test('basic test', () => {
    const state = atom('hello world');
    expect(state.value).toBe('hello world');
  });

  test('selector test', () => {
    const state = atom('hello');
    const select = selector(state, s => s.length);

    const s1 = select.subscribe(value => {
      expect(value).toBe(5);
    });
    s1.unsubscribe();

    state.set('h');
    const s2 = select.subscribe(value => {
      expect(value).toBe(1);
    });
    s2.unsubscribe();
  });

  test('combined selector', done => {
    const state1 = atom('hello');
    const state2 = atom('world');
    const select = selector(zip(state1, state2), ([s1, s2]) => `${s1} ${s2}`);

    const s1 = select.subscribe(value => {
      expect(value).toBe('hello world');
    });
    s1.unsubscribe();

    state2.set('selector');
    const s2 = select.subscribe(value => {
      expect(value).toBe('hello selector');
      done();
    });
    s2.unsubscribe();
  });
});
