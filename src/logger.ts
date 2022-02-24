export type TraceTarget = 'all' | 'named' | 'none';

let index = 0;
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

  console.log(index++, `Triggered ${label} with`, payload);
};

export const logForAtom = <T = any>(label: string, prev?: T, curr?: T) => {
  snapshot.atoms[label] = { prev, curr };

  if (traceTarget === 'none') return;
  if (traceTarget === 'named' && label.charAt(0) === '#') return;

  console.log(index++, `Changed ${label} from`, prev, 'to', curr);
};

export const logSnapshot = () => {
  console.log('Current snapshot', snapshot);
};
