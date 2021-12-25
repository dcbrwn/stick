import { on } from './dom'
import {createTag, tuple} from './util'

type Observer<T> = (value: T) => void
type Producer<T> = (next: Observer<T>) => (() => void) | void

export type Operator<In, Out> = (input: O<In>) => O<Out>

export type O<T> = (observer: Observer<T>) => (() => number)

export const [tagObservable, isObservable] = createTag<O<unknown>>()

export function observable<T> (): [O<T>, (value: T) => void] {
  const observers = new Set<Observer<T>>()

  return [
    tagObservable((observer: Observer<T>): (() => number) => {
      observers.add(observer)

      return () => {
        if (!observers.has(observer)) {
          throw new Error('You fool!')
        }

        observers.delete(observer)

        return observers.size
      }
    }),
    (value: T) => {
      observers.forEach((observer) => observer(value))
    },
  ]
}

export function fromProducer<T> (producer: Producer<T>): O<T> {
  const [observe, next] = observable<T>()
  let stopProducer: (() => void) | true | undefined

  return tagObservable((observer: Observer<T>): (() => number) => {
    if (!stopProducer) {
      stopProducer = producer(next) || true
    }

    const forget = observe(observer)

    return () => {
      const observersLeft = forget()

      if (observersLeft === 0) {
        if (typeof stopProducer === 'function') stopProducer()
        stopProducer = undefined
      }

      return observersLeft
    }
  })
}

export function fromEvent<E extends Event> (
  target: EventTarget,
  eventType: E['type'],
  options: EventListenerOptions = {}
): O<E> {
  return fromProducer<E>((next) => {
    const listener = next as Observer<Event>

    return on(target, eventType, listener, options)
  })
}

export function of<T> (...items: T[]): O<T> {
  return fromProducer<T> ((next) => {
    console.log(items)
    for (const item of items) next(item)
  })
}

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

export type UnifyO<T extends unknown[]> = T extends [O<infer R>, ...(infer Rest)]
  ? R | UnifyO<Rest>
  : never

export function merge<T extends O<unknown>[]>(...inputs: T): O<UnifyO<T>> {
  return fromProducer<UnifyO<T>>((next) => {
    const unsubs = inputs.map((observe) => observe(next as Observer<unknown>))
    return () => unsubs.forEach(unsub => unsub())
  })
}