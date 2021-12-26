import { on } from '../dom'
import { O, observable, Observer, tagObservable } from './observable'

type Producer<T> = (next: Observer<T>) => (() => void) | void

export function fromProducer<T> (producer: Producer<T>): O<T> {
  const [observe, next] = observable<T>()
  let stopProducer: (() => void) | true | undefined

  return tagObservable((observer: Observer<T>): (() => void) => {
    const forget = observe(observer)

    if (!stopProducer) {
      stopProducer = producer(next) || true
    }

    return () => {
      forget()
      if (typeof stopProducer === 'function') stopProducer()
      stopProducer = undefined
    }
  })
}

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
  return fromProducer<E>((next) => {
    const listener = next as Observer<Event>

    return on(target, eventType, listener, options)
  })
}
