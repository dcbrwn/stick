import { describe, it } from 'mocha'
import { expect, mockFn } from 'earljs'
import { pipe } from './pipe'
import { observable } from './observable'
import { map } from './operators'

describe('pipe', () => {
  it('should feed single operator', () => {
    const spy1 = mockFn().returns(1)
    const observer = mockFn().returns(null)
    const [value$, notify] = observable()

    const chain$ = pipe(value$, map(spy1))
    chain$(observer)
    notify(9000)

    expect(spy1).toHaveBeenCalledExactlyWith([
      [9000]
    ])
    expect(observer).toHaveBeenCalledExactlyWith([
      [1]
    ])
  })

  it('should chain multiple operators', () => {
    const spy1 = mockFn().returns(1)
    const spy2 = mockFn().returns(2)
    const observer = mockFn().returns(null)
    const [value$, notify] = observable()

    const chain$ = pipe(value$, map(spy1), map(spy2))
    chain$(observer)
    notify(9000)

    expect(spy1).toHaveBeenCalledExactlyWith([
      [9000]
    ])
    expect(spy2).toHaveBeenCalledExactlyWith([
      [1]
    ])
    expect(observer).toHaveBeenCalledExactlyWith([
      [2]
    ])
  })
})
