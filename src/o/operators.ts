import { O, tagObservable } from './observable'

export type Operator<In, Out> = (input: O<In>) => O<Out>

export function throttleToFrame<T> (input: O<T>): O<T> {
  const nextFrameTasks: VoidFunction[] = []

  function handleTasks () {
    for (let i = 0, len = nextFrameTasks.length; i < len; i += 1) {
      nextFrameTasks[i]()
    }
    nextFrameTasks.length = 0
  }

  function addTask (task: VoidFunction) {
    if (nextFrameTasks.length === 0) {
      requestAnimationFrame(handleTasks)
    }

    nextFrameTasks.push(task)
  }

  return tagObservable((notify) => {
    let nextValue: T | undefined
    let isScheduled = false

    function handleNextFrame () {
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

export const map = <T, R> (fn: (value: T) => R) => (input: O<T>): O<R> => {
  return tagObservable((notify) => {
    return input((value) => notify(fn(value)))
  })
}

export const scan = <Memo, Value> (fn: (memo: Memo, value: Value) => Memo, init: Memo) =>
  (input: O<Value>): O<Memo> => {
    return tagObservable((notify) => {
      let memo = init
      return input((value) => {
        notify(memo = fn(memo, value))
      })
    })
  }

export const filter = <T> (fn: (value: T) => boolean) => (input: O<T>): O<T> => {
  return tagObservable((notify) => {
    return input((value) => {
      if (fn(value)) notify(value)
    })
  })
}
