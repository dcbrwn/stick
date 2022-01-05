import { O } from './observable';
declare const fromArray: <T>(items: T[]) => O<T>;
declare const fromEvent: <E extends Event>(target: EventTarget, eventType: E["type"], options?: EventListenerOptions) => O<E>;
declare const isBroadcast: (obj: unknown) => obj is O<unknown>;
declare const broadcast: <T>(input: O<T>) => O<T>;
declare type UnifyO<T extends unknown[]> = T extends [O<infer R>, ...(infer Rest)] ? R | UnifyO<Rest> : never;
declare const merge: <T extends O<unknown>[]>(...inputs: T) => O<UnifyO<T>>;
export { fromArray, fromEvent, isBroadcast, broadcast, merge };
