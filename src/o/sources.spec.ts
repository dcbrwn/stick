import { describe, it } from 'mocha'
import { expect, mockFn } from 'earljs'
import { from } from './sources'

describe('from', () => {
  it('creates observable from a single primitive', () => {
    const observer = mockFn().returns(undefined)

    from('hello')(observer)

    expect(observer).toHaveBeenCalledExactlyWith([
      ['hello']
    ])
  })

  it('creates observable from multiple arguments', () => {
    const observer = mockFn().returns(undefined)

    from('hello', 'world')(observer)

    expect(observer).toHaveBeenCalledExactlyWith([
      ['hello'],
      ['world']
    ])
  })

  it('creates observable from an array', () => {
    const observer = mockFn().returns(undefined)

    from(['hello', 'world'])(observer)

    expect(observer).toHaveBeenCalledExactlyWith([
      ['hello'],
      ['world']
    ])
  })

  it('creates observable from an iterator', () => {
    const observer = mockFn().returns(undefined)

    const iterator = new Set(['hello', 'world']).values()
    from(iterator)(observer)

    expect(observer).toHaveBeenCalledExactlyWith([
      ['hello'],
      ['world']
    ])
  })

  it('creates observable from a function', () => {
    const observer = mockFn().returns(undefined)

    const producer = (notify: (value: string) => void): (() => void) => {
      notify('hello')
      notify('world')

      return () => {}
    }

    from(producer)(observer)

    expect(observer).toHaveBeenCalledExactlyWith([
      ['hello'],
      ['world']
    ])
  })
})
