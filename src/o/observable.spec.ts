import { describe, it } from 'mocha'
import { expect, mockFn } from 'earljs'
import { isObservable, observable } from './observable'
import { noop } from '../util'

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

  it('should notify multiple observers', () => {
    const [observe, notify] = observable()
    const observer1 = mockFn(noop)
    const observer2 = mockFn(noop)

    observe(observer1)
    observe(observer2)
    notify('hello world')

    expect(observer1).toHaveBeenCalledExactlyWith([
      ['hello world']
    ])
    expect(observer2).toHaveBeenCalledExactlyWith([
      ['hello world']
    ])
  })

  it('should not allow duplicate observers', () => {
    const [observe] = observable()

    expect(() => {
      observe(noop)
      observe(noop)
    }).toThrow(Error, 'Observer already registered')
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
    }).toThrow(Error, 'Observer already forgotten')
  })
})
