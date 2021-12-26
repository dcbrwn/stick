import { O, Observer } from './observable'
import { fromProducer } from './sources'

export type Operator<In, Out> = (input: O<In>) => O<Out>

export function throttle<T> (input: O<T>): O<T> {
  return fromProducer((next) => {
    let nextFrame: number | undefined
    let nextValue: T | undefined

    const handleNextFrame = () => {
      next(nextValue!)
      nextFrame = undefined
    }

    return input((value) => {
      nextValue = value
      if (nextFrame === undefined) {
        nextFrame = requestAnimationFrame(handleNextFrame)
      }
    })
  })
}

export const map = <T, R> (fn: (value: T) => R) => (input: O<T>): O<R> => {
  return fromProducer<R>((next) => {
    return input((value) => next(fn(value)))
  })
}

export const reduce = <Memo, Value> (fn: (memo: Memo, value: Value) => Memo, init: Memo) =>
  (input: O<Value>): O<Memo> => {
    return fromProducer<Memo>((next) => {
      let memo = init
      return input((value) => {
        next(memo = fn(memo, value))
      })
    })
  }

export const filter = <T> (fn: (value: T) => boolean) => (input: O<T>): O<T> => {
  return fromProducer<T>((next) => {
    return input((value) => {
      if (fn(value)) next(value)
    })
  })
}

type UnifyO<T extends unknown[]> = T extends [O<infer R>, ...(infer Rest)]
  ? R | UnifyO<Rest>
  : never

export function merge<T extends O<unknown>[]> (...inputs: T): O<UnifyO<T>> {
  return fromProducer<UnifyO<T>>((next) => {
    const unsubs = inputs.map((observe) => observe(next as Observer<unknown>))
    return () => unsubs.forEach(unsub => unsub())
  })
}
