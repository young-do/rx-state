<script setup lang="ts">
import { dispatch, logSnapshot, setLogLevel } from '@youngdo/rx-state';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { AddTodo, ChangeTodoListStatus, DeleteTodoList } from './store/action';
import { Todo, todoList$ } from './store/states';
import { rxToRef } from './utils';

const todoList = rxToRef(todoList$);
const text = ref('');
const filter = ref<Todo['status'] | null>(null);

const filteredTodoList = computed(() =>
  todoList.value.filter(todo => {
    if (filter.value === null) return true;
    return todo.status === filter.value;
  }),
);

const addTodo = () => {
  if (text.value) {
    dispatch(AddTodo(text.value));
    text.value = '';
  }
};
const changeTodoStatus = (todo: Todo) => {
  const { id, status } = todo;
  const nextStatus = status === 'active' ? 'completed' : 'active';
  dispatch(ChangeTodoListStatus([{ id, status: nextStatus }]));
};
const changeAllCompleted = () => {
  dispatch(
    ChangeTodoListStatus(
      todoList.value.filter(todo => todo.status === 'active').map(todo => ({ id: todo.id, status: 'completed' })),
    ),
  );
};
const deleteTodo = (id: number) => {
  dispatch(DeleteTodoList([id]));
};
const deleteAllCompleted = () => {
  const idList = todoList.value.filter(todo => todo.status === 'completed').map(todo => todo.id);
  dispatch(DeleteTodoList(idList));
};

const changeFilterByHash = () => {
  const hash = location.hash;
  filter.value = hash === '#/active' ? 'active' : hash === '#/completed' ? 'completed' : null;
};

onMounted(() => {
  setLogLevel('all');
  logSnapshot();

  window.addEventListener('hashchange', changeFilterByHash);
  changeFilterByHash();
});

onUnmounted(() => {
  window.removeEventListener('hashchange', changeFilterByHash);
});
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" v-model="text" @keypress.enter="addTodo" />
    </header>
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" @click="changeAllCompleted" />
      <label for="toggle-all">Mark all as complete</label>

      <ul class="todo-list">
        <li v-for="todo in filteredTodoList" :key="todo.id" :class="{ completed: todo.completed }">
          <div class="view">
            <input
              :id="'toggle-todo-' + todo.id"
              class="toggle"
              type="checkbox"
              :checked="todo.completed"
              @click="changeTodoStatus(todo)"
            />
            <label :for="'toggle-todo-' + todo.id">{{ todo.text }}</label>
            <button class="destroy" @click="deleteTodo(todo.id)"></button>
          </div>
        </li>
      </ul>
    </section>
    <footer class="footer">
      <span class="todo-count">{{ filteredTodoList.length }}</span>
      <ul class="filters">
        <li>
          <a href="#/" :class="{ selected: filter === null }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: filter === 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: filter === 'completed' }">Completed</a>
        </li>
      </ul>
      <button class="clear-completed" @click="deleteAllCompleted">Clear completed</button>
    </footer>
  </section>
</template>
