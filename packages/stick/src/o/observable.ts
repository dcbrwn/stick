import { createTag } from '../util'

export type Observer<T> = (value: T) => void

export type O<T> = (observer: Observer<T>) => (() => void)

export const [tagObservable, isObservable] = createTag<O<unknown>>()

export function observable<T> (): [O<T>, (value: T) => void] {
  let observer: Observer<T> | undefined

  return [
    tagObservable((newObserver: Observer<T>): (() => void) => {
      if (observer) throw new Error('No dice!')

      observer = newObserver

      return () => {
        if (!observer) {
          throw new Error('You fool!')
        }

        observer = undefined
      }
    }),
    (value: T) => {
      if (observer) observer(value)
    }
  ]
}
