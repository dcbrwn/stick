import { Maybe } from '../definitions'
import { O, tagObservable } from './observable'

type Operator<In, Out> = (input: O<In>) => O<Out>

const throttleToFrame = <T> (input: O<T>): O<T> => {
  const nextFrameTasks: VoidFunction[] = []

  const handleTasks = () => {
    for (let i = 0, len = nextFrameTasks.length; i < len; i += 1) {
      nextFrameTasks[i]()
    }
    nextFrameTasks.length = 0
  }

  const addTask = (task: VoidFunction) => {
    if (nextFrameTasks.length === 0) {
      requestAnimationFrame(handleTasks)
    }

    nextFrameTasks.push(task)
  }

  return tagObservable((notify) => {
    let nextValue: T | undefined
    let isScheduled = false

    const handleNextFrame = () => {
      isScheduled = false
      notify(nextValue!)
    }

    return input((value) => {
      nextValue = value

      if (!isScheduled) {
        isScheduled = true
        addTask(handleNextFrame)
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

  return (input: O<T>): O<T> => tagObservable((notify) => {
    if (last) notify(last)
    return input((value) => {
      last = value
      notify(value)
    })
  })
}

export {
  type Operator,
  throttleToFrame,
  map,
  tap,
  scan,
  filter,
  rememberLast
}
