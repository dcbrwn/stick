import { O } from './o';
export declare type EventSource<E extends Event, Mapped = unknown> = O<Mapped> & {
    dispatchEvent(event: E): boolean | undefined | void;
};
export declare const tagEventSource: <T extends EventSource<Event, unknown>>(obj: T) => T, isEventSource: (obj: unknown) => obj is EventSource<Event, unknown>;
export declare function eventSource<E extends Event>(): EventSource<E, E>;
export declare function eventSource<E extends Event, R>(map: (event: E) => R): EventSource<E, R>;
