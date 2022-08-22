export type LogLevel = 'all' | 'named' | 'none';

let logLevel: LogLevel = 'none';

const snapshot = {
  actions: Object.create(null) as Record<string, any>,
  atoms: Object.create(null) as Record<string, any>,
};

const skipLogging = (label: string): boolean => {
  if (logLevel === 'none') return true;
  if (logLevel === 'named' && label.startsWith('#')) return true;
  return false;
};

export const setLogLevel = (level: LogLevel) => {
  logLevel = level;
};

export const logForAction = <T = any>(label: string, payload: T) => {
  snapshot.actions[label] = payload;

  if (skipLogging(label)) return;

  console.log(`[rx-state:action] \x1b[94m${label}`, payload);
};

export const logForAtom = <T = any>(label: string, prev?: T, curr?: T) => {
  snapshot.atoms[label] = { prev, curr };

  if (skipLogging(label)) return;

  console.log(`\t[rx-state:atom] \x1b[35m${label}`, prev, '→', curr);
};

export const logSnapshot = () => {
  console.log('[rx-state:snapshot]', snapshot);
};

export const logWarn = (label: string, message: string) => {
  if (skipLogging(label)) return;

  console.warn(`[rx-state:warn] ${message}`);
};
