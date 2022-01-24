import { on } from '../dom'
import { noop } from '../util'
import { O, Observer, tagObservable } from './observable'

const fromEvent = <E extends Event> (
  target: EventTarget,
  eventType: E['type'],
  options: EventListenerOptions = {}
): O<E> => {
  return tagObservable((notify) => {
    const listener = notify as Observer<Event>

    return on(target, eventType, listener, options)
  })
}

const fromArray = <T> (source: T[]): O<T> =>
  tagObservable<O<T>>((notify: Observer<T>) => {
    for (let i = 0, len = source.length; i < len; i += 1) notify(source[i])

    return noop
  })

const fromIterator = <T> (source: Iterator<T>) =>
  tagObservable<O<T>>((notify: Observer<T>) => {
    let item
    while (!(item = source.next()).done) {
      notify(item.value)
    }

    return () => {
      if (source.throw) source.throw(new Error('Iterator cancelled'))
    }
  })

const from = <T> (source: T | T[] | O<T> | Iterator<T>, ...tail: T[]): O<T> => {
  if (tail.length > 0) {
    return fromArray([source as T, ...tail])
  } else if (Array.isArray(source)) {
    return fromArray(source)
  } else if (typeof source === 'function') {
    return tagObservable(source as O<T>)
  } else if (typeof (source as Iterator<T>).next === 'function') {
    return fromIterator(source as Iterator<T>)
  } else {
    return fromArray([source as T])
  }
}

type UnifyO<T extends unknown[]> = T extends [O<infer R>, ...(infer Rest)]
  ? R | UnifyO<Rest>
  : never

const merge = <T extends O<unknown>[]> (...inputs: T): O<UnifyO<T>> => {
  return tagObservable((notify) => {
    const forgetFns = inputs.map((observe) => observe(notify as Observer<unknown>))
    return () => forgetFns.forEach(forget => forget())
  })
}

export {
  fromEvent,
  fromArray,
  fromIterator,
  from,
  merge
}
