import { createAction } from '@youngdo/rx-state';
import type { Todo } from './states';

export const ADD_TODO = createAction<Todo['text']>('ADD_TODO');
export const DELETE_TODO_LIST = createAction<Todo['id'][]>('DELETE_TODO_LIST');
export const CHANGE_TODO_LIST_STATUS = createAction<Pick<Todo, 'id' | 'status'>[]>('CHANGE_TODO_LIST_STATUS');
