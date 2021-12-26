import { O, Observer, tagObservable } from './observable'

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

  return tagObservable((next) => {
    let nextValue: T | undefined
    let isScheduled = false

    function handleNextFrame () {
      isScheduled = false
      next(nextValue!)
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
  return tagObservable((next) => {
    return input((value) => next(fn(value)))
  })
}

export const scan = <Memo, Value> (fn: (memo: Memo, value: Value) => Memo, init: Memo) =>
  (input: O<Value>): O<Memo> => {
    return tagObservable((next) => {
      let memo = init
      return input((value) => {
        next(memo = fn(memo, value))
      })
    })
  }

export const filter = <T> (fn: (value: T) => boolean) => (input: O<T>): O<T> => {
  return tagObservable((next) => {
    return input((value) => {
      if (fn(value)) next(value)
    })
  })
}

type UnifyO<T extends unknown[]> = T extends [O<infer R>, ...(infer Rest)]
  ? R | UnifyO<Rest>
  : never

export function merge<T extends O<unknown>[]> (...inputs: T): O<UnifyO<T>> {
  return tagObservable((next) => {
    const unsubs = inputs.map((observe) => observe(next as Observer<unknown>))
    return () => unsubs.forEach(unsub => unsub())
  })
}
