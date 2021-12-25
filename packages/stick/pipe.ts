import { O, Operator } from "./o";

export { pipe }

function pipe<In, Out>(input: O<In>, op1: Operator<In, Out>): O<Out>
function pipe<In, A, Out>(
  input: O<In>,
  ...ops: [
    Operator<In, A>,
    Operator<A, Out>,
  ]
): O<Out>
function pipe<In, A, B, Out>(
  input: O<In>,
  ...ops: [
    Operator<In, A>,
    Operator<A, B>,
    Operator<B, Out>,
  ]
): O<Out>
function pipe<In, A, B, C, Out>(
  input: O<In>,
  ...ops: [
    Operator<In, A>,
    Operator<A, B>,
    Operator<A, C>,
    Operator<C, Out>,
  ]
): O<Out>
function pipe<In, A, B, C, D, Out>(
  input: O<In>,
  ...ops: [
    Operator<In, A>,
    Operator<A, B>,
    Operator<A, C>,
    Operator<A, D>,
    Operator<D, Out>,
  ]
): O<Out>
function pipe(input: O<any>, ...ops: Operator<any, any>[]): O<unknown> {
  if (ops.length === 0) return input

  return ops.reduce<O<unknown>>((memo, operator) => operator(memo), input)
}