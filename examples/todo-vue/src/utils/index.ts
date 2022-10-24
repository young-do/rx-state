import { Atom } from '@youngdo/rx-state';
import { computed, onMounted, Ref, ref } from 'vue';

export const rxToRef = <T>(atom: Atom<T>) => {
  const _ref = ref(atom.value) as Ref<T>;

  onMounted(() => {
    const subscription = atom.$.subscribe(value => (_ref.value = value));
    return () => subscription.unsubscribe();
  });

  // @note: for readonly
  return computed(() => _ref.value);
};
