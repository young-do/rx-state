import { createAction } from '@youngdo/rx-state';
import type { Todo } from './states';

export const AddTodo = createAction<Todo['text']>('AddTodo');
export const DeleteTodoList = createAction<Todo['id'][]>('DeleteTodoList');
export const ChangeTodoListStatus = createAction<Pick<Todo, 'id' | 'status'>[]>('ChangeTodoListStatus');
