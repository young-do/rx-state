import { RxState } from '@youngdo/rx-state';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

export const useRxState = <T>(rxState: RxState<T>) => {
  const subscribe = (callback: () => void) => () => rxState.subscribe(callback);
  const getSnapshot = () => rxState.value;
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const set = rxState.set;

  return [state, set] as const;
};

export const useRxValue = <T>(rxState: RxState<T>) => {
  const subscribe = (callback: () => void) => () => rxState.subscribe(callback);
  const getSnapshot = () => rxState.value;
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return state;
};

// @note: if you cannot use "useSyncExternalStore" hook, use below code.
// export const useRxState = <T>(rxState: RxState<T>) => {
//   const [state, setState] = useState<T>(rxState.value);
//   const set = rxState.set;

//   useEffect(() => {
//     const subscription = rxState.subscribe(value => setState(value));
//     return () => subscription.unsubscribe();
//   }, []);

//   return [state, set];
// };

// export const useRxValue = <T>(rxState: RxState<T>) => {
//   const [state, setState] = useState<T>(rxState.value);

//   useEffect(() => {
//     const subscription = rxState.subscribe(value => setState(value));
//     return () => subscription.unsubscribe();
//   }, []);

//   return state;
// };
