import { Displayed } from './definitions'
import { toString } from './util'

export const createElement = (tagName: string) => document.createElement(tagName)

export const createTextNode = (text: string) => document.createTextNode(text)

export const on = (target: EventTarget, eventType: string, handler: (e: Event) => boolean | undefined | void, options?: EventListenerOptions) => {
  target.addEventListener(eventType, handler, options)
  return () => target.removeEventListener(eventType, handler, options)
}

export const setAttr = (target: Element, key: string, value: Displayed): void => {
  if (typeof value === 'boolean') {
    target.toggleAttribute(key, value)
  } else {
    target.setAttribute(key, toString(value))
  }
}

export const appendChild = (target: Node, child: Node): Node => target.appendChild(child)
