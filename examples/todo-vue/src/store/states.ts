import { createAtom } from '@youngdo/rx-state';
import { ADD_TODO, CHANGE_TODO_LIST_STATUS, DELETE_TODO_LIST } from './action';

export type Todo = {
  id: number;
  status: 'active' | 'completed';
  completed: boolean;
  text: string;
};

export const todoList$ = createAtom<Todo[]>([], 'todoList$', () => {
  let id = 0;

  ADD_TODO.$.subscribe(text => {
    const next = todoList$.value.concat({
      id: id++,
      status: 'active',
      completed: false,
      text,
    });
    todoList$.set(next);
  });

  DELETE_TODO_LIST.$.subscribe(deleteIdList => {
    const next = todoList$.value.filter(todo => !deleteIdList.includes(todo.id));
    todoList$.set(next);
  });

  CHANGE_TODO_LIST_STATUS.$.subscribe(selectedTodoList => {
    const next = todoList$.value.map(todo => {
      const selected = selectedTodoList.find(selected => selected.id === todo.id);
      if (!selected) return todo;
      return {
        ...todo,
        status: selected.status,
        completed: selected.status === 'completed',
      };
    });
    todoList$.set(next);
  });
});
