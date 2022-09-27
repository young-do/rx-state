import { RxState } from '@youngdo/rx-state';
import { computed, onMounted, Ref, ref } from 'vue';

export const rxToRef = <T>(rxState$: RxState<T>) => {
  const _ref = ref(rxState$.value) as Ref<T>;

  onMounted(() => {
    const subscription = rxState$.subscribe(value => (_ref.value = value));
    return () => subscription.unsubscribe();
  });

  // @note: for readonly
  return computed(() => _ref.value);
};
