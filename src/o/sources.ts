import { on } from '../dom'
import { O, Observer, tagObservable } from './observable'

export function fromArray<T> (items: T[]): O<T> {
  return tagObservable<O<T>>((notify: Observer<T>) => {
    // eslint-disable-next-line prefer-const
    for (let i = 0, len = items.length; i < len; i += 1) notify(items[i])
    return () => {}
  })
}

export function fromEvent<E extends Event> (
  target: EventTarget,
  eventType: E['type'],
  options: EventListenerOptions = {}
): O<E> {
  return tagObservable((notify) => {
    const listener = notify as Observer<Event>

    return on(target, eventType, listener, options)
  })
}

export function broadcast<T> (input: O<T>): O<T> {
  const observers = new Set<Observer<T>>()
  let forget: VoidFunction | undefined

  return tagObservable((notify) => {
    if (observers.size === 0) {
      forget = input((value) => observers.forEach((notify) => notify(value)))
    }

    observers.add(notify)

    return () => {
      observers.delete(notify)

      if (observers.size === 0) forget!()
    }
  })
}

type UnifyO<T extends unknown[]> = T extends [O<infer R>, ...(infer Rest)]
  ? R | UnifyO<Rest>
  : never

export function merge<T extends O<unknown>[]> (...inputs: T): O<UnifyO<T>> {
  return tagObservable((notify) => {
    const forgetFns = inputs.map((observe) => observe(notify as Observer<unknown>))
    return () => forgetFns.forEach(forget => forget())
  })
}