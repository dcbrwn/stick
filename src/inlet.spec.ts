import { describe, it } from 'mocha'
import { expect, mockFn } from 'earljs'
import { inlet, intoInlet } from './inlet'
import { noop } from './util'
import { from, observable } from './o'

describe('inlet', () => {
  it('notifies about new observers', () => {
    const number$ = inlet<number>()
    const observer = mockFn(noop)

    number$.observer$((notify) => {
      if (notify) notify(9000)
    })
    number$(observer)

    expect(observer).toHaveBeenCalledExactlyWith([
      [9000]
    ])
  })

  it('notifies when observable is forgotten', () => {
    const number$ = inlet<number>()
    const observer = mockFn(noop)

    number$.observer$(observer)
    const forget = number$(noop)
    forget()

    expect(observer.calls.length).toEqual(2)
    expect(observer.calls[1].args).toEqual([null])
  })
})

describe('intoInlet', () => {
  it('forwards value from given obserable to an inlet', () => {
    const observer = mockFn(noop)
    const result$ = inlet<number>()
    const source$ = from(42)

    intoInlet(result$, source$)
    result$(observer)

    expect(observer).toHaveBeenCalledExactlyWith([
      [42]
    ])
  })

  it('forgets observable when inlet is forgotten', () => {
    const observer = mockFn(noop)
    const result$ = inlet<number>()
    const [source$, notify] = observable<number>()

    intoInlet(result$, source$)
    const forget = result$(observer)

    forget()
    notify(42)

    expect(observer).toHaveBeenCalledExactlyWith([])
  })
})
