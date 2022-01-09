import { Maybe } from '../definitions'
import { on } from '../dom'
import { createTag } from '../util'
import { O, Observer, tagObservable } from './observable'

const fromArray = <T> (items: T[]): O<T> => {
  return tagObservable<O<T>>((notify: Observer<T>) => {
    for (let i = 0, len = items.length; i < len; i += 1) notify(items[i])
    return () => {}
  })
}

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
    if (observers.size === 0) {
      forget = input(notifyAll)
    }

    observers.add(notify)

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
  fromArray,
  fromEvent,
  isBroadcast,
  broadcast,
  merge
}
