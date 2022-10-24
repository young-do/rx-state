export type LogLevel = 'all' | 'named' | 'none';

const PREFIX_PRIVATE = '#';
const snapshot = {
  actions: Object.create(null) as Record<string, any>,
  atoms: Object.create(null) as Record<string, any>,
};

let logLevel: LogLevel = 'none';

export const logForAction = <T = any>(label: string, payload: T) => {
  snapshot.actions[label] = payload;

  if (skipLogging(label)) return;

  console.log(`[rx-state:action] \x1b[94m${label}`, payload);
};

export const logForAtom = <T = any>(label: string, prev?: T, curr?: T) => {
  snapshot.atoms[label] = { prev, curr };

  if (skipLogging(label)) return;

  console.log(`[rx-state:atom] \x1b[35m${label}`, prev, '→', curr);
};

export const setLogLevel = (level: LogLevel) => {
  logLevel = level;
};

export const logSnapshot = () => {
  console.log('[rx-state:snapshot]', snapshot);
};

export const getDefaultLabel = () => {
  return PREFIX_PRIVATE + Math.random().toString(36).substr(2, 11);
};

const skipLogging = (label: string): boolean => {
  if (logLevel === 'none') return true;
  if (logLevel === 'named' && label.startsWith(PREFIX_PRIVATE)) return true;
  return false;
};
