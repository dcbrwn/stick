import { O } from './observable'
import { Operator } from './operators'

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
function pipe (input: O<any>, ...ops: Operator<any, any>[]): O<unknown> {
  const len = ops.length
  let result = input

  for (let i = 0; i < len; i += 1) {
    result = ops[i](result)
  }

  return result
}

export { pipe }
