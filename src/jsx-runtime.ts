import { onMount, observe } from './context'
import {
  Renderable,
  Renderer,
  stickKey,
  AnyProps,
  Displayed,
  Fragment,
  StickMeta,
  Maybe
} from './definitions'
import { createElement, on, setAttr, createTextNode, createFragment, appendChild } from './dom'
import { Inlet, intoInlet, isInlet } from './inlet'
import { isObservable, O, broadcast, isBroadcast, fromEvent } from './o'
import { camelToKebab, toString } from './util'

type AttrValue<T> = T | O<T>

type EventHandler<E extends Event> = ((event: E) => void) | Inlet<E>

namespace JSX {
  interface ElementProps {
    children?: (string | O<any> | Renderer)[]
  }

  type BrowserEvents = {
    [K in keyof GlobalEventHandlersEventMap as `on${Capitalize<K>}`]?: EventHandler<GlobalEventHandlersEventMap[K]>
  }

  interface HTMLAttributes extends ElementProps, BrowserEvents{
    // TODO: Steal proper typings from preact:
    // https://github.com/preactjs/preact/blob/9d761c56bafc77be48780885391dd6f72ba23359/src/jsx.d.ts#L622
    class?: AttrValue<Displayed>
    title?: AttrValue<Displayed>
    style?: AttrValue<Displayed>
  }

  export interface IntrinsicElements {
    [tagName: string]: HTMLAttributes
  }
}

const eventHandlerKey = /^on[A-Z]/

const bindEventHandler = (element: Element, key: string, handler: EventHandler<Event>) => {
  const eventType = camelToKebab(key.slice(2))

  if (isInlet(handler)) {
    onMount(() => intoInlet(handler, fromEvent(element, eventType)))
  } else {
    onMount(() => on(element, eventType, handler as (event: Event) => void))
  }
}

const bindProp = (
  element: Element,
  key: string,
  value: unknown,
  meta?: StickMeta
): void => {
  const needsReflect = !meta || key in meta.reflect

  if (needsReflect) {
    if (isObservable(value)) {
      observe(value, (nextValue) => setAttr(element, key, nextValue as Displayed))
    } else {
      setAttr(element, key, value as Displayed)
    }
  }

  if (meta) {
    let propValue = value

    if (isObservable(propValue) && !isInlet(value)) {
      propValue = isBroadcast(value) ? value : broadcast(value as O<unknown>)
    }

    // We don't know what element we actually dealing with here
    // All the typechecking will happen in the template
    // @ts-expect-error
    if (!element.props) element.props = {}
    // @ts-expect-error
    element.props[key] = propValue
  }
}

const createElementFromTag = (tag: Renderable): DocumentFragment | HTMLElement => {
  if (tag === Fragment) return createFragment()
  return createElement(typeof tag === 'string' ? tag : tag[stickKey].tagName)
}

const jsx: Renderer = (tag: Renderable, props: AnyProps) => {
  const element = createElementFromTag(tag)
  const { children, ...properties } = props

  for (const [key, value] of Object.entries(properties)) {
    if (key.startsWith('_')) continue
    else if (eventHandlerKey.test(key)) {
      bindEventHandler(element as HTMLElement, key, value)
    } else {
      bindProp(element as HTMLElement, key, value, Reflect.get(element, stickKey))
    }
  }

  if (children) {
    const c = Array.isArray(children) ? children : [children]

    for (const child of c) {
      let childElement: Maybe<Node>

      if (!child && typeof child !== 'boolean') {
        continue
      } else if (child instanceof HTMLElement) {
        childElement = child
      } else if (isObservable(child)) {
        const textNode = createTextNode('')
        observe(child, (value) => {
          textNode.data = toString(value as Displayed)
        })
        childElement = textNode
      } else {
        childElement = createTextNode(toString(child))
      }

      appendChild(element, childElement)
    }
  }

  return element
}

const jsxs = jsx

export {
  type JSX,
  jsx,
  jsxs,
  Fragment
}
