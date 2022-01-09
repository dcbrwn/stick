/** @jsxImportSource .. */

import { describe, it } from 'mocha'
import { expect } from 'earljs'
import { repeat } from './repeat'
import { observable } from '../o'
import { observe, render } from '../context'

const createTestbed = () => {
  // History of observations by item templates
  // history[itemIndex][observationNumber]
  const history: string[][] = []

  const [value$, notify] = observable<string[]>()

  const [element, ctx] = render(() => {
    return <div>{repeat(value$, (item$, index) => {
      // Record history of values passed to this item of collection
      observe(item$, (newValue) => {
        const historyAtIndex = history[index] || []
        historyAtIndex.push(newValue)
        history[index] = historyAtIndex
      })

      return <p>{item$}</p>
    })}</div>
  })

  return {
    container: element.children[0],
    mount: () => ctx.mount(),
    notify,
    history
  }
}

describe('repeat directive', () => {
  it('expands with observed collection', () => {
    const { notify, container, mount } = createTestbed()
    mount()

    notify(['hello'])

    expect(container.children.length).toEqual(1)
    expect(container.children[0].outerHTML).toEqual('<p>hello</p>')

    notify(['hello', 'world'])

    expect(container.children.length).toEqual(2)
    expect(container.children[0].outerHTML).toEqual('<p>hello</p>')
    expect(container.children[1].outerHTML).toEqual('<p>world</p>')
  })

  it('shrinks with observed collection', () => {
    const { notify, container, mount } = createTestbed()
    mount()

    notify(['hello', 'world'])

    expect(container.children.length).toEqual(2)
    expect(container.children[0].outerHTML).toEqual('<p>hello</p>')
    expect(container.children[1].outerHTML).toEqual('<p>world</p>')

    notify(['world'])

    expect(container.children.length).toEqual(1)
    expect(container.children[0].outerHTML).toEqual('<p>world</p>')

    notify([])

    expect(container.children.length).toEqual(0)
  })

  it('notifies visible items', () => {
    const { notify, container, mount, history } = createTestbed()
    mount()

    notify(['hello', 'world'])

    expect(container.children.length).toEqual(2)
    expect(container.children[0].outerHTML).toEqual('<p>hello</p>')
    expect(container.children[1].outerHTML).toEqual('<p>world</p>')

    notify(['die', 'hard'])

    expect(container.children.length).toEqual(2)
    expect(container.children[0].outerHTML).toEqual('<p>die</p>')
    expect(container.children[1].outerHTML).toEqual('<p>hard</p>')

    expect(history).toEqual([
      ['hello', 'die'],
      ['world', 'hard']
    ])
  })

  it('reuses rendered items', () => {
    const { notify, container, mount } = createTestbed()
    mount()

    notify(['hello', 'world'])

    const [...children] = container.children

    notify(['die', 'hard'])

    expect([...container.children].every((child, index) => {
      return child === children[index]
    })).toEqual(true)
  })

  it('reuses old items when collection expands again', () => {
    const { notify, container, mount } = createTestbed()
    mount()

    notify(['hello', 'world'])

    const oldInstance = container.children[1]

    // Shrink the collection and ensure the container reflects that
    notify(['shrink'])
    expect(container.children.length).toEqual(1)

    // Expand collection again
    notify(['die', 'hard'])

    expect(container.children[1]).toEqual(oldInstance)
  })

  it('stops observing invisible items', () => {
    const { notify, mount, history } = createTestbed()
    mount()

    notify(['hello', 'world'])
    notify(['die'])
    notify(['hard'])

    expect(history).toEqual([
      ['hello', 'die', 'hard'],
      ['world']
    ])
  })

  it('should not observe collection until mounted', () => {
    const { notify, mount, history } = createTestbed()

    notify(['hello', 'world'])
    expect(history).toEqual([])

    mount()

    notify(['hello', 'world'])
    expect(history).toEqual([
      ['hello'],
      ['world']
    ])
  })

  it('stops observing collection when unmounted', () => {
    const { notify, mount, history } = createTestbed()
    const unmount = mount()

    notify(['hello', 'world'])

    unmount()

    notify(['die', 'hard'])

    expect(history).toEqual([
      ['hello'],
      ['world']
    ])
  })

  it('observes items when re-mounted', () => {
    const { container, notify, mount, history } = createTestbed()
    const firstUnmount = mount()

    notify(['hello', 'world'])
    firstUnmount()

    mount()
    notify(['die', 'hard'])

    expect(history).toEqual([
      ['hello', 'hello', 'die'],
      ['world', 'world', 'hard']
    ])
    expect(container.children.length).toEqual(2)
    expect(container.children[0].outerHTML).toEqual('<p>die</p>')
    expect(container.children[1].outerHTML).toEqual('<p>hard</p>')
  })
})
