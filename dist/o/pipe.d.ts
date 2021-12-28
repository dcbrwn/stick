import { O } from './observable';
import { Operator } from './operators';
declare function pipe<In, Out>(input: O<In>, op1: Operator<In, Out>): O<Out>;
declare function pipe<In, A, Out>(input: O<In>, ...ops: [
    Operator<In, A>,
    Operator<A, Out>
]): O<Out>;
declare function pipe<In, A, B, Out>(input: O<In>, ...ops: [
    Operator<In, A>,
    Operator<A, B>,
    Operator<B, Out>
]): O<Out>;
declare function pipe<In, A, B, C, Out>(input: O<In>, ...ops: [
    Operator<In, A>,
    Operator<A, B>,
    Operator<A, C>,
    Operator<C, Out>
]): O<Out>;
declare function pipe<In, A, B, C, D, Out>(input: O<In>, ...ops: [
    Operator<In, A>,
    Operator<A, B>,
    Operator<A, C>,
    Operator<A, D>,
    Operator<D, Out>
]): O<Out>;
export { pipe };
