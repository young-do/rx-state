import { on, atom } from '@youngdo/rx-state';
import { AddTodo, ChangeTodoListStatus, DeleteTodoList } from './action';

export type Todo = {
  id: number;
  status: 'active' | 'completed';
  text: string;
};

export const todoList$ = atom<Todo[]>([], 'todoList$', () => {
  let id = 0;

  on(AddTodo).subscribe(text => {
    const next = todoList$.value.concat({
      id: id++,
      status: 'active',
      text,
    });
    todoList$.set(next);
  });

  on(DeleteTodoList).subscribe(deleteIdList => {
    const next = todoList$.value.filter(todo => !deleteIdList.includes(todo.id));
    todoList$.set(next);
  });

  on(ChangeTodoListStatus).subscribe(selectedTodoList => {
    const next = todoList$.value.map(todo => {
      const selected = selectedTodoList.find(selected => selected.id === todo.id);
      if (!selected) return todo;
      return {
        ...todo,
        status: selected.status,
      };
    });
    todoList$.set(next);
  });
});
