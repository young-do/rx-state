export type LogLevel = 'all' | 'named' | 'none';

const PREFIX_PRIVATE = '#';
const snapshot: Record<string, Record<string, unknown>> = {};

let logLevel: LogLevel = 'none';

export const logging =
  <T>(field: string, debugLabel: string) =>
  (payload: T) => {
    if (!snapshot[field]) snapshot[field] = {};
    snapshot[field][debugLabel] = payload;
    if (skipLogging(debugLabel)) return;
    console.log(`[${field}:${debugLabel}]`, payload);
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
