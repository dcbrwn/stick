import { O } from './observable';
export declare type Operator<In, Out> = (input: O<In>) => O<Out>;
export declare function throttleToFrame<T>(input: O<T>): O<T>;
export declare const map: <T, R>(fn: (value: T) => R) => (input: O<T>) => O<R>;
export declare const scan: <Memo, Value>(fn: (memo: Memo, value: Value) => Memo, init: Memo) => (input: O<Value>) => O<Memo>;
export declare const filter: <T>(fn: (value: T) => boolean) => (input: O<T>) => O<T>;
