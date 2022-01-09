import { Maybe } from '../definitions'
import { O, tagObservable } from './observable'

type Operator<In, Out> = (input: O<In>) => O<Out>

const throttle = <T> (defer: (callback: VoidFunction) => void = requestAnimationFrame) =>
  (input: O<T>): O<T> => {
    return tagObservable((notify) => {
      let nextValue: Maybe<T>
      let isScheduled = false

      const handleNextFrame = () => {
        isScheduled = false
        notify(nextValue!)
      }

      return input((value) => {
        nextValue = value

        if (!isScheduled) {
          isScheduled = true
          defer(handleNextFrame)
        }
      })
    })
  }

const map = <From, To> (fnOrValue: ((value: From) => To) | To) =>
  (input: O<From>): O<To> => tagObservable((notify) => {
    return typeof fnOrValue === 'function'
      ? input((value) => notify((fnOrValue as (value: From) => To)(value)))
      : input(() => notify(fnOrValue))
  })

const tap = <T> (fn: (value: T) => void) =>
  (input: O<T>): O<T> => tagObservable((notify) => {
    return input((value) => {
      fn(value)
      notify(value)
    })
  })

const scan = <Memo, Value> (fn: (memo: Memo, value: Value) => Memo, init: Memo) =>
  (input: O<Value>): O<Memo> => tagObservable((notify) => {
    let memo = init
    return input((value) => notify(memo = fn(memo, value)))
  })

const filter = <T> (fn: (value: T) => boolean) =>
  (input: O<T>): O<T> => tagObservable((notify) => {
    return input((value) => {
      if (fn(value)) notify(value)
    })
  })

const rememberLast = <T> (init: Maybe<T> = undefined) => {
  let last = init

  return (input: O<T>): O<Maybe<T>> => tagObservable((notify) => {
    notify(last)

    return input((value) => {
      last = value
      notify(value)
    })
  })
}

export {
  type Operator,
  throttle,
  map,
  tap,
  scan,
  filter,
  rememberLast
}
