/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */

import { filter, fromArray, map, pipe, reduce } from 'stick/o'
import { from } from 'most'
import { Observer } from 'stick/o/observable'

function createArray (n: number) {
  const array = new Array(n)
  for (let i = 0; i < n; i += 1) {
    array[i] = i
  }
  return array
}

function deopt1 (callback: Function) {
  let obj = window as any

  try {
    if (obj.flag) {
      throw new Error('Dont opt me out!')
    }

    return callback()
  } finally {
    obj.blah = !obj.blah
  }
}

function deopt0 (callback: Function) {
  return callback()
}

const deopt = deopt0

const even = (value: number) => deopt(() => value % 2 === 0)
const add1 = (value: number) => deopt(() => value + 1)
const sum = (a: number, b: number) => deopt(() => (a + b) % 12345)

const op = (notify: Observer<number>) => {
  let memo = 0

  return (x: number) => {
    if (even(x)) return

    let map = add1(x)
    memo = sum(map, memo)
    notify(memo)
  }
}

const cases = {
  baseline_iterator (input: number[], consume: Observer<number>) {
    let memo = 0
    for (const x of input) {
      if (even(x)) {
        memo = sum(memo, add1(x))
        consume(memo)
      }
    }
  },
  baseline_callack (input: number[], consume: Observer<number>) {
    let observe = op(consume)
    let len = input.length
    for (let i = 0; i < len; i += 1) {
      observe(input[i])
    }
  },
  baseline (input: number[], consume: Observer<number>) {
    let memo = 0
    let len = input.length
    for (let i = 0; i < len; i += 1) {
      let x = input[i]
      if (even(x)) {
        memo = (memo + add1(x)) % 12345
        consume(memo)
      }
    }
  },
  stick (input: number[], consume: Observer<number>) {
    const observe = pipe(
      fromArray(input),
      filter(even),
      map(add1),
      reduce(sum, 0)
    )

    observe(consume)
  },
  stick_dense (input: number[], consume: Observer<number>) {
    const observe = op(consume)
    fromArray(input)(observe)
  },
  most (input: number[], consume: Observer<number>) {
    return from(input)
      .filter(even)
      .map(add1)
      .scan(sum, 0)
      .observe(consume)
  },
  most_dense (input: number[], consume: Observer<number>) {
    const observe = op(consume)
    return from(input)
      .observe(observe)
  }
}

async function bench (n: number, samples: number = 1) {
  const log = document.createElement('code')

  // const consume = (x: number) => {}
  // const consume = (x: number) => console.log(x)
  let last = 0
  const consume = (x: number) => {
    last = x
  }

  for (let i = 0; i < samples; i += 1) {
    console.log(`\n\nSample ${i}:`)
    const input = createArray(n)

    const results: Record<string, object> = {}
    for (const [key, value] of Object.entries(cases)) {
      const startKey = 'start' + key
      performance.mark(startKey)
      await value(input, consume)
      performance.measure(key, startKey)
      results[key] = { duration: performance.getEntriesByName(key).pop()!.duration | 0 }
      log.append(document.createTextNode(last.toString()))
    }

    console.table(results)
    await setTimeout(() => {}, 100)
  }
}

// @ts-expect-error
window.bench = bench
