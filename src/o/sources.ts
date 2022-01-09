import { Maybe } from '../definitions'
import { on } from '../dom'
import { createTag, noop } from '../util'
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

const [tagBroadcast, isBroadcast] = createTag<O<unknown>>()

const broadcast = <T> (input: O<T>): O<T> => {
  const observers = new Set<Observer<T>>()
  let forget: Maybe<VoidFunction>

  const notifyAll = (value: T) => {
    // Manually iterating over the observers collection on V8 9.4
    // is roughly two times faster than using forEach with lambda
    const iterator = observers.values()
    let notify: Maybe<IteratorResult<Observer<T>, undefined>>
    while (!(notify = iterator.next()).done) notify.value(value)
  }

  return tagBroadcast(tagObservable((notify) => {
    observers.add(notify)

    if (observers.size === 1) {
      forget = input(notifyAll)
    }

    return () => {
      observers.delete(notify)

      if (observers.size === 0) forget!()
    }
  }))
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
  isBroadcast,
  broadcast,
  merge
}
