import { O } from './observable';
declare type Operator<In, Out> = (input: O<In>) => O<Out>;
declare const throttleToFrame: <T>(input: O<T>) => O<T>;
declare const map: <From, To>(fnOrValue: To | ((value: From) => To)) => (input: O<From>) => O<To>;
declare const tap: <T>(fn: (value: T) => void) => (input: O<T>) => O<T>;
declare const scan: <Memo, Value>(fn: (memo: Memo, value: Value) => Memo, init: Memo) => (input: O<Value>) => O<Memo>;
declare const filter: <T>(fn: (value: T) => boolean) => (input: O<T>) => O<T>;
export { type Operator, throttleToFrame, map, tap, scan, filter };
