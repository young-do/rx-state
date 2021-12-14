import { createAction } from 'rxjs-store-core';
import type { Todo } from './states';

export const AddTodo = createAction<Todo['text']>('AddTodo');
export const DeleteTodoList = createAction<Todo['id'][]>('DeleteTodo');
export const ChangeTodoListStatus = createAction<Pick<Todo, 'id' | 'status'>[]>('ChangeTodoStatus');
