export function debounce(fn: (...args: any[]) => void, timeout: number) {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(fn, timeout, ...args);
  };
}
