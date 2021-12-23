import { on } from './dom'
import { createTag } from './util'

type Observer<T> = (value: T) => void
type Producer<T> = (next: Observer<T>) => (() => void) | void

export type O<T> = (observer?: Observer<T>) => (() => void)

const [tagObservable, isObservable] = createTag<O<unknown>>()

export { isObservable }

export function observable<T> (producer: Producer<T>): O<T> {
  const observers = new Set<Observer<T>>()
  let detach: (() => void) | true | undefined

  function next (value: T): void {
    observers.forEach((observer) => observer(value))
  }

  function subscribe (observer: Observer<T> = () => {}): (() => void) {
    if (!detach) {
      detach = producer(next) || true
    }

    observers.add(observer)

    return () => {
      if (!observers.has(observer)) {
        throw new Error('You fool!')
      }

      observers.delete(observer)

      if (observers.size === 0 && detach) {
        if (typeof detach === 'function') detach()
        detach = undefined
      }
    }
  }

  return tagObservable(subscribe)
}

export type Thunk<In, Out> = (input: O<In>) => O<Out>

export const [thunk, isThunk] = createTag<(input: O<unknown>) => O<unknown>>()

export function fromEvent<E extends Event> (
  target: EventTarget,
  eventType: E['type'],
  options: EventListenerOptions = {}
): O<E> {
  return observable<E>((next) => {
    const listener = next as Observer<Event>

    return on(target, eventType, listener, options)
  })
}

export function throttle<T> (input: O<T>): O<T> {
  return observable((next) => {
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

export function map<T, R> (input: O<T>, fn: (value: T) => R): O<R> {
  return observable<R>((next) => {
    return input((value) => next(fn(value)))
  })
}
