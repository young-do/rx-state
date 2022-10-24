# @youngdo/rx-state

State management library by using [Rxjs](https://github.com/ReactiveX/rxjs), and inspired by [adorable](https://github.com/developer-1px/adorable)

## Getting started

### install

```
npm install @youngdo/rx-state rxjs
yarn add @youngdo/rx-state rxjs
```

## Example (Simple Counter)

### setup

```ts
// action.ts
import { createAction } from '@youngdo/rx-state';

export const INCREASE = createAction<void>();
export const DECREASE = createAction<void>();

// state.ts
import { createAtom } from '@youngdo/rx-state';

export const count$ = createAtom<number>(0, 'count$', count$ => {
  INCREASE.$.subscribe(() => count$.set(count$.value + 1));
  DECREASE.$.subscribe(() => count$.set(count$.value - 1));

  // // or use 'update'
  // INCREASE.$.subscribe(() => count$.update(prev => prev + 1));
  // DECREASE.$.subscribe(() => count$.update(prev => prev - 1));
});
```

### on React

💡 `useRxState` code at [here](./examples/todo-react/src/hooks/useRxState.ts).

```jsx
import { count$ } from 'state';
import { INCREASE, DECREASE } from 'action';
import { useRxValue } from 'hooks';

function App() {
  const count = useRxValue(count$);

  const increase = () => INCREASE();
  const decrease = () => DECREASE();

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

  const increase = () => INCREASE();
  const decrease = () => DECREASE();
</script>

<div>
  count: {$count$}
  <button on:click="{increase}">+</button>
  <button on:click="{decrease}">-</button>
</div>
```

### on Vue

💡 `rxToRef` code at [here](./examples/todo-vue/src/utils/index.ts).

```vue
<script>
import { defineComponent } from 'vue';

import { count$ } from 'state';
import { INCREASE, DECREASE } from 'action';
import { rxToRef } from 'utils';

export default defineComponent({
  setup() {
    return {
      count: rxToRef(count$),
    };
  },
  methods: {
    increase() {
      INCREASE();
    },
    decrease() {
      DECREASE();
    },
  },
});
</script>

<template>
  <div>
    count: {{ count }}
    <button @click="increase">+</button>
    <button @click="decrease">-</button>
  </div>
</template>
```
