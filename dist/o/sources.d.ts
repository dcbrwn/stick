import { O } from './observable';
export declare function fromArray<T>(items: T[]): O<T>;
export declare function fromEvent<E extends Event>(target: EventTarget, eventType: E['type'], options?: EventListenerOptions): O<E>;
export declare const broadcast: <T>(input: O<T>) => O<T>;
declare type UnifyO<T extends unknown[]> = T extends [O<infer R>, ...(infer Rest)] ? R | UnifyO<Rest> : never;
export declare function merge<T extends O<unknown>[]>(...inputs: T): O<UnifyO<T>>;
export {};
