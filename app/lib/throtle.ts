export function throttle(fn: (...args: any[]) => void, timeout: number) {
  let current = new Date().getTime();

  return function (...args: any[]) {
    console.log(new Date().getTime() - current);
    if (new Date().getTime() - current >= timeout) {
      current = new Date().getTime();
      fn(...args);
    }
  };
}
