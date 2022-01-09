import { Displayed, Maybe } from './definitions'
import { toString } from './util'

const createElement = (tagName: string) => document.createElement(tagName)

const createTextNode = (text: string) => document.createTextNode(text)

const createComment = (comment: string = '') => document.createComment(comment)

const createFragment = () => document.createDocumentFragment()

const CONTAINER_TAG = 's-container'

const createContainer = () => createElement(CONTAINER_TAG)

const on = (target: EventTarget, eventType: string, handler: (e: Event) => boolean | undefined | void, options?: EventListenerOptions) => {
  target.addEventListener(eventType, handler, options)
  return () => target.removeEventListener(eventType, handler, options)
}

const setAttr = (target: Element, key: string, value: Displayed): void => {
  if (typeof value === 'boolean') {
    target.toggleAttribute(key, value)
  } else {
    target.setAttribute(key, toString(value))
  }
}

const appendChild = (target: Node, child: Node): Node => target.appendChild(child)

const ensureElement = (element: Maybe<DocumentFragment | Element>): HTMLElement => {
  let result: Maybe<HTMLElement>

  if (element instanceof DocumentFragment) {
    result = createContainer()
    result.appendChild(element)
  } else if (element instanceof HTMLElement) {
    result = element
  } else {
    result = createContainer()
  }

  return result
}

if (typeof window !== 'undefined') {
  customElements.define(CONTAINER_TAG, class extends HTMLElement {})
}

export {
  createElement,
  createTextNode,
  createComment,
  createFragment,
  createContainer,
  on,
  setAttr,
  appendChild,
  ensureElement
}
