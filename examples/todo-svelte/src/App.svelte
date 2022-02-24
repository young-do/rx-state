<script lang="ts">
import { dispatch, setTraceTarget } from '@youngdo/rx-state';
import { onMount } from 'svelte';
import { AddTodo, ChangeTodoListStatus, DeleteTodoList } from './store/action';
import { Todo, todoList$ } from './store/states';

let text: string = '';
let filter: Todo['status'] | null = null;

$: filteredTodoList = $todoList$.filter(todo => {
  if (filter === null) return true;
  return todo.status === filter;
});

const handleKeydown = (e: KeyboardEvent) => {
  e.key === 'Enter' && addTodo();
};
const addTodo = () => {
  if (text) {
    dispatch(AddTodo(text));
    text = '';
  }
};
const changeTodoStatus = (id: number, status: Todo['status']) => () => {
  const nextStatus = status === 'active' ? 'completed' : 'active';
  dispatch(ChangeTodoListStatus([{ id, status: nextStatus }]));
};
const changeAllCompleted = () => {
  dispatch(
    ChangeTodoListStatus(
      todoList$.value.filter(todo => todo.status === 'active').map(todo => ({ id: todo.id, status: 'completed' })),
    ),
  );
};
const deleteTodo = (id: number) => () => {
  dispatch(DeleteTodoList([id]));
};
const deleteAllCompleted = () => {
  const idList = todoList$.value.filter(todo => todo.status === 'completed').map(todo => todo.id);
  dispatch(DeleteTodoList(idList));
};

onMount(() => {
  setTraceTarget('all')

  const changeFilterByHash = () => {
    const hash = location.hash;
    filter = hash === '#/active' ? 'active' : hash === '#/completed' ? 'completed' : null;
  };
  window.onhashchange = changeFilterByHash;
  changeFilterByHash();
});
</script>

<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input class="new-todo" placeholder="What needs to be done?" bind:value={text} on:keypress={handleKeydown} />
  </header>
  <section class="main">
    <input id="toggle-all" class="toggle-all" type="checkbox" on:click={changeAllCompleted} />
    <label for="toggle-all">Mark all as complete</label>

    <ul class="todo-list">
      {#each filteredTodoList as todo (todo.id)}
        <li class:completed={todo.status === 'completed'}>
          <div class="view">
            <input
              id={`toggle-todo-${todo.id}`}
              class="toggle"
              type="checkbox"
              checked={todo.status === 'completed'}
              on:click={changeTodoStatus(todo.id, todo.status)}
            />
            <label for={`toggle-todo-${todo.id}`}>{todo.text}</label>
            <button class="destroy" on:click={deleteTodo(todo.id)} />
          </div>
        </li>
      {/each}
    </ul>
  </section>
  <footer class="footer">
    <span class="todo-count">{filteredTodoList.length}</span>
    <ul class="filters">
      <li>
        <a href="#/" class:selected={filter === null}>All</a>
      </li>
      <li>
        <a href="#/active" class:selected={filter === 'active'}>Active</a>
      </li>
      <li>
        <a href="#/completed" class:selected={filter === 'completed'}>Completed</a>
      </li>
    </ul>
    <button class="clear-completed" on:click={deleteAllCompleted}>Clear completed</button>
  </footer>
</section>
