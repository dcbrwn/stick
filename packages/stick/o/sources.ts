import { on } from '../dom'
import { O, Observer, tagObservable } from './observable'

export function fromArray<T> (items: T[]): O<T> {
  return tagObservable<O<T>>((observer: Observer<T>) => {
    // eslint-disable-next-line prefer-const
    for (let i = 0, len = items.length; i < len; i += 1) observer(items[i])
    return () => {}
  })
}

export function fromEvent<E extends Event> (
  target: EventTarget,
  eventType: E['type'],
  options: EventListenerOptions = {}
): O<E> {
  return tagObservable((next) => {
    const listener = next as Observer<Event>

    return on(target, eventType, listener, options)
  })
}
