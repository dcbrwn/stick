/** @jsxImportSource . */

import { afterEach, describe, it } from 'mocha'
import { expect, mockFn } from 'earljs'
import { element } from './element'
import { StickElement, stickKey } from './definitions'

const createTagFactory = () => {
  let counter = 0
  return () => `x-element-${counter++}`
}

const createTag = createTagFactory()

describe('element', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers custom element', () => {
    const tag = createTag()
    element(tag, () => <div></div>)

    const MyElement = customElements.get(tag)

    expect(!!MyElement).toEqual(true)

    const myElement = (new MyElement!()) as StickElement

    expect(myElement).toBeA(HTMLElement)
    expect(myElement.connectedCallback).toBeA(Function)
    expect(myElement.disconnectedCallback).toBeA(Function)
    expect(myElement[stickKey]).toEqual({
      tagName: tag,
      reflect: {}
    })
  })

  it('renders template when connected to the DOM', () => {
    const tag = createTag()
    const template = mockFn((props: { value: number }, el: HTMLElement) => <span>{props.value}</span>)
    element(tag, template)

    const el = document.createElement(tag) as StickElement<{ value: number }>
    el.props = { value: 9000 }

    expect(template).toHaveBeenCalledExactlyWith([])

    document.body.appendChild(el)

    expect(template).toHaveBeenCalledExactlyWith([
      [el.props, el]
    ])
    expect(document.body.innerHTML).toEqual(`<${tag}><span>9000</span></${tag}>`)
  })

  it('renders fragments to DOM', () => {
    const tag = createTag()
    const template = mockFn((props: { value: number }, el: HTMLElement) => <>{props.value}</>)
    element(tag, template)

    const el = document.createElement(tag) as StickElement<{ value: number }>
    el.props = { value: 9000 }
    document.body.appendChild(el)

    expect(document.body.innerHTML).toEqual(`<${tag}>9000</${tag}>`)
  })
})
