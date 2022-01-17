export const createEffector = <T>(flag?: T) => {
  return new Effector(flag);
};

class Effector<T> {
  callbacks: Function[] = [];

  constructor(private flag: T) {}

  register(callback: (flag: T) => any) {
    this.callbacks.push(callback);
  }
  run() {
    this.callbacks.forEach(callback => callback(this.flag));
  }
}
