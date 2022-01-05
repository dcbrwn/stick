declare type Observer<T> = (value: T) => void;
declare type O<T> = (observer: Observer<T>) => (() => void);
declare const tagObservable: <T extends O<unknown>>(obj: T) => T, isObservable: (obj: unknown) => obj is O<unknown>;
declare const observable: <T>() => [O<T>, (value: T) => void];
export { type Observer, type O, observable, tagObservable, isObservable };
