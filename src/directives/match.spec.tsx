/** @jsxImportSource .. */

import { describe, it } from 'mocha'
import { expect } from 'earljs'
import { observable } from '../o'
import { match } from './match'
import { render } from '../context'

enum Variant {
  HELLO = 'hello',
  WORLD = 'world'
}

const createTestbed = () => {
  // History of observations by item templates
  // history[observationNumber]
  const history: Variant[] = []

  const [value$, notify] = observable<Variant>()

  const [element, ctx] = render(() => {
    return <div>{match(value$, (value) => {
      // Record history of values passed to this item of collection
      history.push(value)

      switch (value) {
        case Variant.HELLO:
          return <div>hello</div>
        case Variant.WORLD:
          return <p>world</p>
      }
    })}</div>
  })

  return {
    container: element,
    mount: () => ctx.mount(),
    notify,
    history
  }
}

describe('repeat directive', () => {
  it('switches templates', () => {
    const { notify, container, mount } = createTestbed()
    mount()

    notify(Variant.HELLO)

    expect(container.innerHTML).toEqual('<div>hello</div>')

    notify(Variant.WORLD)

    expect(container.innerHTML).toEqual('<p>world</p>')
  })

  it('caches templates', () => {
    const { notify, container, mount, history } = createTestbed()
    mount()

    notify(Variant.HELLO)
    const oldInstance = container.children[0]
    notify(Variant.WORLD)
    notify(Variant.HELLO)

    expect(container.children[0]).toEqual(oldInstance)
    expect(history).toEqual([Variant.HELLO, Variant.WORLD])
  })

  it('should not observe changes when unmounted', () => {
    const { notify, mount, history } = createTestbed()
    const unmount = mount()

    notify(Variant.HELLO)
    unmount()
    notify(Variant.WORLD)

    expect(history).toEqual([Variant.HELLO])
  })

  it('resume observer when re-mounted', () => {
    const { notify, container, mount, history } = createTestbed()
    const unmount = mount()

    notify(Variant.HELLO)
    unmount()
    mount()
    notify(Variant.WORLD)

    expect(container.innerHTML).toEqual('<p>world</p>')
    expect(history).toEqual([Variant.HELLO, Variant.WORLD])
  })
})
