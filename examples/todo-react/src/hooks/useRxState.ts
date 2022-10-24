import { Atom } from '@youngdo/rx-state';
import { useState, useEffect } from 'react';

export const useRxState = <T>(atom: Atom<T>) => {
  const [state, setState] = useState<T>(atom.value);
  const set = atom.set;

  useEffect(() => {
    const subscription = atom.$.subscribe(value => setState(value));
    return () => subscription.unsubscribe();
  }, [atom]);

  return [state, set] as const;
};

export const useRxValue = <T>(atom: Atom<T>) => {
  const [state, setState] = useState<T>(atom.value);

  useEffect(() => {
    const subscription = atom.$.subscribe(value => setState(value));
    return () => subscription.unsubscribe();
  }, [atom]);

  return state;
};
