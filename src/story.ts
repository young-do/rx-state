import { logForStory } from './logger';

export const story = (debugLabelOrCallback: string | Function, callback?: Function) => {
  const debugLabel = typeof debugLabelOrCallback === 'string' ? debugLabelOrCallback : getDefaultLabel();
  callback = typeof debugLabelOrCallback === 'function' ? debugLabelOrCallback : callback;

  Promise.resolve().then(() => {
    logForStory(debugLabel);
    callback?.();
  });
};

let index = 0;
const getDefaultLabel = () => `#${index++}_unnamed_story`;
