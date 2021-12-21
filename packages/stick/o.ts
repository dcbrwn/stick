type Observer<T> = (value: T) => void
type Producer<T> = (next: Observer<T>) => (() => void) | void

export class O<T> {
  public readonly subscribe: (observer: Observer<T>) => (() => void)
  public readonly next: (value: T) => void

  constructor (
    subscribe: (observer: Observer<T>) => (() => void),
    next: (value: T) => void
  ) {
    this.subscribe = subscribe
    this.next = next
  }

  public map<R> (fn: (value: T) => R): O<R> {
    return observable<R>((next) => {
      return this.subscribe((value) => next(fn(value)))
    })
  }
}

export function observable<T> (producer?: Producer<T>): O<T> {
  const observers = new Set<Observer<T>>()
  let detach: (() => void) | true | undefined

  function subscribe (observer: Observer<T>): (() => void) {
    if (!detach && producer) {
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

  function next (value: T): void {
    for (const observer of observers) {
      observer(value)
    }
  }

  return new O<T>(subscribe, next)
}

export function fromEvent<E extends Event> (
  target: EventTarget,
  eventType: E['type'],
  options: EventListenerOptions = {}
): O<E> {
  return observable<E>((next) => {
    const listener = next as Observer<Event>
    target.addEventListener(eventType, listener, options)

    return () => {
      target.removeEventListener(eventType, listener)
    }
  })
}
