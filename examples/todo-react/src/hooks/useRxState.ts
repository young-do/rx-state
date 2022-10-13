import { RxState } from '@youngdo/rx-state';
import { useState, useEffect } from 'react';

export const useRxState = <T>(rxState: RxState<T>) => {
  const [state, setState] = useState<T>(rxState.value);
  const set = rxState.set;

  useEffect(() => {
    const subscription = rxState.subscribe(value => setState(value));
    return () => subscription.unsubscribe();
  }, []);

  return [state, set];
};

export const useRxValue = <T>(rxState: RxState<T>) => {
  const [state, setState] = useState<T>(rxState.value);

  useEffect(() => {
    const subscription = rxState.subscribe(value => setState(value));
    return () => subscription.unsubscribe();
  }, []);

  return state;
};
