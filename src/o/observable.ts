import { createTag } from '../util'

type Observer<T> = (value: T) => void

type O<T> = (observer: Observer<T>) => (() => void)

const [tagObservable, isObservable] = createTag<O<unknown>>()

const observable = <T> (): [O<T>, (value: T) => void] => {
  const observers = new Set<Observer<T>>()
  const notifyAll = (value: T) => {
    for (const notify of observers) {
      notify(value)
    }
  }
  let notify: Observer<T> | undefined

  return [
    tagObservable((newObserver: Observer<T>): (() => void) => {
      if (observers.has(newObserver)) {
        throw new Error('Observer already registered')
      }

      observers.add(newObserver)

      if (observers.size === 1) {
        notify = newObserver
      } else if (observers.size > 1) {
        notify = notifyAll
      }

      return () => {
        if (!observers.has(newObserver)) {
          throw new Error('Observer already forgotten')
        }

        observers.delete(newObserver)

        if (observers.size === 1) {
          notify = [...observers].pop()
        } else if (observers.size === 0) {
          notify = undefined
        }
      }
    }),
    (value: T) => {
      if (notify) notify(value)
    }
  ]
}

export {
  type Observer,
  type O,
  observable,
  tagObservable,
  isObservable
}
