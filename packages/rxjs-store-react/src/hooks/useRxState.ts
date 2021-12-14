import { RxState } from 'rxjs-store-core';
import { useEffect, useState } from 'react';

export const useRxState = <T>(rxState: RxState<T>) => {
  const [state, setState] = useState<T>();
  const set = rxState.set;

  useEffect(() => {
    const subscription = rxState.subscribe(value => setState(value));
    return () => subscription.unsubscribe();
  }, []);

  return [state, set];
};

export const useRxValue = <T>(rxState: RxState<T>) => {
  const [state, setState] = useState<T>();

  useEffect(() => {
    const subscription = rxState.subscribe(value => setState(value));
    return () => subscription.unsubscribe();
  }, []);

  return state;
};
