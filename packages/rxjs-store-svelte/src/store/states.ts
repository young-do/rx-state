import { on, reducer } from 'rxjs-store-core';
import { AddTodo, ChangeTodoListStatus, DeleteTodoList } from './action';

export type Todo = {
  id: number;
  status: 'active' | 'completed';
  text: string;
};

export const todoList$ = reducer<Todo[]>([], todoList$ => {
  let id = 0;

  todoList$.subscribe(todo => console.error(todo));

  on(AddTodo).subscribe(text => {
    todoList$.set(
      todoList$.value.concat({
        id: id++,
        status: 'active',
        text,
      }),
    );
  });

  on(DeleteTodoList).subscribe(deleteIdList => {
    todoList$.set(todoList$.value.filter(todo => !deleteIdList.includes(todo.id)));
  });

  on(ChangeTodoListStatus).subscribe(selectedTodoList => {
    todoList$.set(
      todoList$.value.map(todo => {
        const selected = selectedTodoList.find(selected => selected.id === todo.id);

        if (selected) {
          return {
            ...todo,
            status: selected.status,
          };
        }
        return todo;
      }),
    );
  });
});
