<script lang="ts">
import { logSnapshot, setLogLevel } from '@youngdo/rx-state';
import { defineComponent } from 'vue';
import { ADD_TODO, CHANGE_TODO_LIST_STATUS, DELETE_TODO_LIST } from './store/action';
import { Todo, todoList$ } from './store/states';
import { rxToRef } from './utils';

export default defineComponent({
  setup() {
    return {
      todoList: rxToRef(todoList$),
    };
  },
  data() {
    return {
      text: '',
      filter: null as Todo['status'] | null,
    };
  },
  computed: {
    filteredTodoList() {
      return this.filter === null ? this.todoList : this.todoList.filter(todo => todo.status === this.filter);
    },
  },
  methods: {
    addTodo() {
      if (this.text) {
        ADD_TODO(this.text);
        this.text = '';
      }
    },
    changeTodoStatus(todo: Todo) {
      const { id, status } = todo;
      const nextStatus = status === 'active' ? 'completed' : 'active';
      CHANGE_TODO_LIST_STATUS([{ id, status: nextStatus }]);
    },
    changeAllCompleted() {
      CHANGE_TODO_LIST_STATUS(
        this.todoList.filter(todo => todo.status === 'active').map(todo => ({ id: todo.id, status: 'completed' })),
      );
    },
    deleteTodo(id: number) {
      DELETE_TODO_LIST([id]);
    },
    deleteAllCompleted() {
      const idList = this.todoList.filter(todo => todo.status === 'completed').map(todo => todo.id);
      DELETE_TODO_LIST(idList);
    },
    changeFilterByHash() {
      const hash = location.hash;
      this.filter = hash === '#/active' ? 'active' : hash === '#/completed' ? 'completed' : null;
    },
  },
  mounted() {
    setLogLevel('all');
    logSnapshot();

    window.addEventListener('hashchange', this.changeFilterByHash);
    this.changeFilterByHash();
  },
  unmounted() {
    window.removeEventListener('hashchange', this.changeFilterByHash);
  },
});
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos(vue)</h1>
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
