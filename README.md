# @youngdo/rx-state

State management library by using [Rxjs](https://github.com/ReactiveX/rxjs), and inspired by [adorable]https://github.com/developer-1px/adorable)

## Getting started

### install

```
npm install rxjs @youngdo/rx-state
yarn add rxjs @youngdo/rx-state
```

### setup

```ts
// action.ts
export const INCREASE = createAction<void>('INCREASE');
export const DECREASE = createAction<void>('DECREASE');

// state.ts
export const count$ = reducer<number>(0, 'count$', count$ => {
  on(INCREASE).subscribe(() => count$.set(count$.value + 1));
  on(DECREASE).subscribe(() => count$.set(count$.value - 1));
});
```

### on React

💡 useRxState code at [here](./examples/todo-react/src/hooks/useRxState.ts).

```jsx
import { count$ } from 'state';
import { INCREASE, DECREASE } from 'action';
import { useRxValue } from 'hooks';

function App() {
  const count = useRxValue(count$);

  const increase = () => dispatch(INCREASE);
  const decrease = () => dispatch(DECREASE);

  return (
    <div>
      count: {count}
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </div>
  );
}
```

### on Svelte

```html
<script>
  import { count$ } from 'state';
  import { INCREASE, DECREASE } from 'action';

  const increase = () => dispatch(INCREASE);
  const decrease = () => dispatch(DECREASE);
</script>

<div>
  count: {$count$}
  <button on:click="{increase}">+</button>
  <button on:click="{decrease}">-</button>
</div>
```
