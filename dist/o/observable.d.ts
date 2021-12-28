export declare type Observer<T> = (value: T) => void;
export declare type O<T> = (observer: Observer<T>) => (() => void);
export declare const tagObservable: <T extends O<unknown>>(obj: T) => T, isObservable: (obj: unknown) => obj is O<unknown>;
export declare const observable: <T>() => [O<T>, (value: T) => void];
