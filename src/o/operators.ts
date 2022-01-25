import { Maybe } from '../definitions'
import { Observer } from './observable'

type Operator<In, Out> = (next: Observer<Out>) => Observer<In>

const throttle = <T> (defer: (callback: VoidFunction) => void = requestAnimationFrame) =>
  (next: Observer<T>) => {
    let nextValue: Maybe<T>
    let isScheduled = false

    const handleNextFrame = () => {
      isScheduled = false
      next(nextValue!)
    }

    return (value: T) => {
      nextValue = value

      if (!isScheduled) {
        isScheduled = true
        defer(handleNextFrame)
      }
    }
  }

const map = <From, To> (fnOrValue: ((value: From) => To) | To) =>
  (next: Observer<To>) => {
    const mapFn = typeof fnOrValue === 'function'
      ? fnOrValue as (value: From) => To
      : (_: From): To => fnOrValue

    return (value: From) => next(mapFn(value))
  }

const tap = <T> (fn: (value: T) => void) =>
  (next: Observer<T>) => (value: T) => {
    fn(value)
    next(value)
  }

const scan = <Memo, Value> (fn: (memo: Memo, value: Value) => Memo, init: Memo) =>
  (next: Observer<Memo>) => {
    let memo = init

    return (value: Value) => {
      memo = fn(memo, value)
      next(memo)
    }
  }

const filter = <T> (fn: (value: T) => boolean) =>
  (next: Observer<T>) => (value: T) => {
    if (fn(value)) next(value)
  }

export {
  type Operator,
  throttle,
  map,
  tap,
  scan,
  filter
}
