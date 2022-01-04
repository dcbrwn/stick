import { describe, it } from 'mocha'
import { expect, mockFn } from 'earljs'
import { isObservable, observable } from './observable'

describe('observable', () => {
  it('should tag "observe" function', () => {
    const [observe] = observable()

    expect(isObservable(observe)).toEqual(true)
  })

  it('notify should call provided observer', () => {
    const observer = mockFn().returns(undefined)
    const [observe, notify] = observable()

    observe(observer)
    notify('whatever')

    expect(observer).toHaveBeenCalledExactlyWith([
      ['whatever']
    ])
  })

  it('should fail when observed more than once', () => {
    const [observe] = observable()

    expect(() => {
      observe(() => {})
      observe(() => {})
    }).toThrow(Error, 'Already observed')
  })

  it('should forget observer when required', () => {
    const observer = mockFn().returns(undefined)
    const [observe, notify] = observable()

    const forget = observe(observer)
    forget()
    notify('whatever')

    expect(observer).toHaveBeenCalledExactlyWith([])
  })

  it('should fail when freed more than once', () => {
    const [observe] = observable()

    const forget = observe(() => {})
    expect(() => {
      forget()
      forget()
    }).toThrow(Error, 'Already forgotten')
  })
})
