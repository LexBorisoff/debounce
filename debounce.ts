// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunction = (...args: any[]) => any;

type CancelFn = () => void;

type Debounced<Callback extends GenericFunction> = (
  ...args: Parameters<Callback>
) => Promise<ReturnType<Callback>>;

type DebounceFn = <Callback extends GenericFunction>(
  callback: Callback,
  wait: number
) => Debounced<Callback> & { cancel: CancelFn };

/**
 * Debounce function that is capable of asynchronously returning the result
 * of calling the provided callback function
 */
const debounce: DebounceFn = function debounce(callback, wait) {
  type Callback = typeof callback;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced: Debounced<Callback> = function debounced(
    this: ThisParameterType<Callback>,
    ...args: Parameters<Callback>
  ) {
    return new Promise<ReturnType<Callback>>((resolve, reject) => {
      const later = () => {
        timer = undefined;

        try {
          const result = callback.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      clearTimeout(timer);
      timer = setTimeout(later, wait);
    });
  };

  const cancel: CancelFn = () => {
    clearTimeout(timer);
  };

  return Object.assign(debounced, { cancel });
};

export default debounce;
