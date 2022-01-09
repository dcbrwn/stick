/** @jsxImportSource . */

import { describe, it } from 'mocha'
import { expect, mockFn } from 'earljs'
import { render } from './context'
import { noop } from './util'
import { from } from './o'
import { inlet } from './inlet'

describe('jsx-runtime', () => {
  it('renders simple template', () => {
    const result = <div>
      <h1>hello</h1>
      <p>world</p>
    </div>

    expect(result.outerHTML).toEqual('<div><h1>hello</h1><p>world</p></div>')
  })

  it('should not render null and undefined', () => {
    const result = <div>{null}{undefined}</div>

    expect(result.outerHTML).toEqual('<div></div>')
  })

  it('renders booleans', () => {
    const result = <div>{false},{true}</div>

    expect(result.outerHTML).toEqual('<div>false,true</div>')
  })

  it('renders observables', () => {
    const value$ = from(42)
    const [result, ctx] = render(() => <div>{value$}</div>)

    ctx.mount()

    expect(result.outerHTML).toEqual('<div>42</div>')
  })

  it('should not render observables until mounted', () => {
    const value$ = from(42)
    const [result] = render(() => <div>{value$}</div>)

    expect(result.outerHTML).toEqual('<div></div>')
  })

  it('mounts event handlers', () => {
    const myHandler = mockFn(noop)
    const [result, ctx] = render(() => <div onClick={myHandler}></div>)

    ctx.mount()
    const event = new MouseEvent('click')
    result.dispatchEvent(event)

    expect(myHandler).toHaveBeenCalledExactlyWith([
      [event]
    ])
  })

  it('unmounts event handlers', () => {
    const myHandler = mockFn(noop)
    const [result, ctx] = render(() => <div onClick={myHandler}></div>)

    const unmount = ctx.mount()
    unmount()
    const event = new MouseEvent('click')
    result.dispatchEvent(event)

    expect(myHandler).toHaveBeenCalledExactlyWith([])
  })

  it('mounts inlets as event handlers', () => {
    const click$ = inlet<MouseEvent>()
    const observer = mockFn(noop)
    const [result, ctx] = render(() => <div onClick={click$}></div>)

    ctx.mount()
    click$(observer)
    const event = new MouseEvent('click')
    result.dispatchEvent(event)

    expect(observer).toHaveBeenCalledExactlyWith([
      [event]
    ])
  })

  it('unmounts inlets as event handlers', () => {
    const click$ = inlet<MouseEvent>()
    const observer = mockFn(noop)
    const [result, ctx] = render(() => <div onClick={click$}></div>)

    const unmount = ctx.mount()
    click$(observer)
    unmount()
    const event = new MouseEvent('click')
    result.dispatchEvent(event)

    expect(observer).toHaveBeenCalledExactlyWith([])
  })
})
