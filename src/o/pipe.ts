import { observable, tagObservable } from '.'
import { Maybe } from '../definitions'
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
// Typescript only allows to overload functions
// eslint-disable-next-line func-style
function pipe (input: O<any>, ...ops: Operator<any, any>[]): O<unknown> {
  const [observe, notify] = observable()
  const next = ops.reduceRight((memo, op) => op(memo), notify)
  let forgetInput: Maybe<VoidFunction>

  return tagObservable((notify) => {
    const forget = observe(notify)

    if (!forgetInput) {
      forgetInput = input(next)
    }

    return () => {
      if (forget()) {
        forgetInput!()
        forgetInput = undefined
        return true
      }
    }
  })
}

export { pipe }
