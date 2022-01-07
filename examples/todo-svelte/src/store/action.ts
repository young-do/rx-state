import { createAction } from '@youngdo/rx-state';
import type { Todo } from './states';

export const AddTodo = createAction<Todo['text']>();
export const DeleteTodoList = createAction<Todo['id'][]>();
export const ChangeTodoListStatus = createAction<Pick<Todo, 'id' | 'status'>[]>();
