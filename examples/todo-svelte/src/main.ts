import App from './App.svelte';
import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';

const app = new App({
  target: document.getElementById('app'),
});

export default app;
