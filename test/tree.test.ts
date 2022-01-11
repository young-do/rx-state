import { createTree } from '../src/tree';

describe('test', () => {
  const tree = createTree();

  afterEach(() => {
    tree.reset();
  });

  it('특정 경로에 저장한 값을 그대로 읽어올 수 있다.', () => {
    const state = tree.query('hello');
    state.set('world');

    expect(state.value).toBe('world');
    expect(tree.query('hello/world').value).toBeUndefined();
    expect(tree.query('/').value).toEqual({ hello: 'world' });
  });

  it('hierarchy 구조를 가진채 값이 저장된다.', () => {
    const state = tree.query('hello');
    state.set({ world: 'it works' });
    state.set({ tree: 'hi' });

    expect(tree.query('/hello/world').value).toBe('it works');
    expect(tree.query('/hello/tree').value).toBe('hi');
    expect(tree.query('/').value).toEqual({ hello: { world: 'it works', tree: 'hi' } });
  });
});
