export type TraceTarget = 'all' | 'named' | 'none';

let traceTarget: TraceTarget = 'none';

const snapshot = {
  actions: Object.create(null) as Record<string, any>,
  atoms: Object.create(null) as Record<string, any>,
};

export const setTraceTarget = (target: TraceTarget) => {
  traceTarget = target;
};

export const logForAction = <T = any>(label: string, payload: T) => {
  snapshot.actions[label] = payload;

  if (traceTarget === 'none') return;
  if (traceTarget === 'named' && label.charAt(0) === '#') return;

  console.log(`[rx-state:action] \x1b[94m${label}`, payload);
};

export const logForAtom = <T = any>(label: string, prev?: T, curr?: T) => {
  snapshot.atoms[label] = { prev, curr };

  if (traceTarget === 'none') return;
  if (traceTarget === 'named' && label.charAt(0) === '#') return;

  console.log(`[rx-state:atom] \x1b[35m${label}`, prev, '→', curr);
};

export const logSnapshot = () => {
  console.log('[rx-state:snapshot]', snapshot);
};
