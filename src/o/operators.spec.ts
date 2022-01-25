import { describe, it } from 'mocha'
import { expect, mockFn } from 'earljs'
import { observable } from './observable'
import { pipe } from './pipe'
import { throttle, map, tap, scan, filter } from './operators'
import { Maybe } from '../definitions'

describe('throttle', () => {
  const mockDefer = (): [(callback: VoidFunction) => void, VoidFunction] => {
    let callback: Maybe<VoidFunction>
    return [
      (cb) => {
        callback = cb
      },
      () => callback ? callback() : undefined
    ]
  }

  it('defers notification with given function', () => {
    const [value$, notify] = observable<string>()
    const [defer, flush] = mockDefer()
    const op$ = pipe(
      value$,
      throttle(defer)
    )
    const observer = mockFn().returns(undefined)

    op$(observer)
    notify('hello')
    notify('world')

    expect(observer).toHaveBeenCalledExactlyWith([])

    flush()

    expect(observer).toHaveBeenCalledExactlyWith([
      ['world']
    ])
  })

  it('correctly forgets observer', () => {
    const [value$, notify] = observable<string>()
    const [defer, flush] = mockDefer()
    const spyDefer = mockFn(defer)
    const op$ = pipe(
      value$,
      throttle(defer)
    )
    const observer = mockFn().returns(undefined)

    const forget = op$(observer)
    forget()
    notify('hello')
    notify('world')
    flush()

    expect(spyDefer).toHaveBeenCalledExactlyWith([])
    expect(observer).toHaveBeenCalledExactlyWith([])
  })
})

describe('map', () => {
  it('maps observed values unsing function', () => {
    const [value$, notify] = observable<string>()
    const op$ = pipe(
      value$,
      map((value) => `hello, ${value}`)
    )
    const observer = mockFn().returns(undefined)

    op$(observer)
    notify('world')

    expect(observer).toHaveBeenCalledExactlyWith([
      ['hello, world']
    ])
  })

  it('replaces all values with a given one, if its not a function', () => {
    const [value$, notify] = observable<string>()
    const op$ = pipe(value$, map(42))
    const observer = mockFn().returns(undefined)

    op$(observer)
    notify('whats the meaning of life?')
    notify('how many dimensions our universe has?')
    notify('how much is too much?')

    expect(observer).toHaveBeenCalledExactlyWith([
      [42],
      [42],
      [42]
    ])
  })

  it('correctly forgets observer', () => {
    const [value$, notify] = observable<string>()
    const fn = mockFn((x) => x)
    const op$ = pipe(value$, map(fn))
    const observer = mockFn().returns(undefined)

    const forget = op$(observer)
    forget()
    notify('hello')
    notify('world')

    expect(fn).toHaveBeenCalledExactlyWith([])
    expect(observer).toHaveBeenCalledExactlyWith([])
  })
})

describe('tap', () => {
  it('calls given callback with an observed value', () => {
    const [value$, notify] = observable<string>()
    const tapCallback = mockFn().returns(undefined)
    const op$ = pipe(value$, tap(tapCallback))
    const observer = mockFn().returns(undefined)

    op$(observer)
    notify('hello')

    expect(tapCallback).toHaveBeenCalledExactlyWith([
      ['hello']
    ])
  })

  it('should not interact with an observed value', () => {
    const [value$, notify] = observable<object>()
    const tapCallback = mockFn().returns(undefined)
    const op$ = pipe(value$, tap(tapCallback))
    const observer = mockFn().returns(undefined)

    const object = Object.freeze({})
    op$(observer)
    notify(object)

    expect(tapCallback).toHaveBeenCalledExactlyWith([
      [object]
    ])
    expect(observer).toHaveBeenCalledExactlyWith([
      [object]
    ])
  })

  it('correctly forgets observer', () => {
    const [value$, notify] = observable<string>()
    const tapCallback = mockFn().returns(undefined)
    const op$ = pipe(value$, tap(tapCallback))
    const observer = mockFn().returns(undefined)

    const forget = op$(observer)
    forget()
    notify('hello')
    notify('world')

    expect(tapCallback).toHaveBeenCalledExactlyWith([])
    expect(observer).toHaveBeenCalledExactlyWith([])
  })
})

describe('scan', () => {
  it('combines observed values with accumulator using provided function', () => {
    const [value$, notify] = observable<number>()
    const op$ = pipe(
      value$,
      scan((a: number, b: number) => a + b, 2)
    )
    const observer = mockFn().returns(undefined)

    op$(observer)
    notify(1)
    notify(2)
    notify(3)

    expect(observer).toHaveBeenCalledExactlyWith([
      [3],
      [5],
      [8]
    ])
  })

  it('correctly forgets observer', () => {
    const [value$, notify] = observable<number>()
    const fn = mockFn((a: number, b: number) => a + b)
    const op$ = pipe(value$, scan(fn, 2))
    const observer = mockFn().returns(undefined)

    const forget = op$(observer)
    forget()
    notify(1)
    notify(2)

    expect(fn).toHaveBeenCalledExactlyWith([])
    expect(observer).toHaveBeenCalledExactlyWith([])
  })
})

describe('filter', () => {
  it('should not notify about filtered out values', () => {
    const [value$, notify] = observable<number>()
    const op$ = pipe(
      value$,
      filter((value: number) => value % 2 === 0)
    )
    const observer = mockFn().returns(undefined)

    op$(observer)
    notify(1)
    notify(2)
    notify(3)
    notify(4)

    expect(observer).toHaveBeenCalledExactlyWith([
      [2],
      [4]
    ])
  })

  it('correctly forgets observer', () => {
    const [value$, notify] = observable<number>()
    const fn = mockFn(() => true)
    const op$ = pipe(value$, filter(fn))
    const observer = mockFn().returns(undefined)

    const forget = op$(observer)
    forget()
    notify(1)
    notify(2)

    expect(fn).toHaveBeenCalledExactlyWith([])
    expect(observer).toHaveBeenCalledExactlyWith([])
  })
})
