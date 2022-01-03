import {
  Renderable,
  Renderer,
  stickKey,
  isRenderResult,
  renderResult,
  AnyProps,
  Displayed,
  Fragment,
  StickBuilder,
  Maybe
} from './definitions'
import { createElement, on, setAttr, createTextNode, createFragment } from './dom'
import { EventSource, isEventSource } from './eventSource'
import { isObservable, O, broadcast, isBroadcast } from './o'
import { camelToKebab, toString } from './util'

type AttrValue<T> = T | O<T>

type EventHandler<E extends Event> = ((event: E) => boolean | undefined | void) | EventSource<E>

export namespace JSX {
  interface ElementProps {
    children?: (string | O<any> | Renderer)[]
  }

  interface HTMLAttributes extends ElementProps {
    // TODO: Steal proper typings from preact:
    // https://github.com/preactjs/preact/blob/9d761c56bafc77be48780885391dd6f72ba23359/src/jsx.d.ts#L622
    class?: AttrValue<Displayed>
    title?: AttrValue<Displayed>
    style?: AttrValue<Displayed>

    onClick?: EventHandler<MouseEvent>
  }

  export interface IntrinsicElements {
    [tagName: string]: HTMLAttributes
  }
}

const eventHandlerKey = /^on[A-Z]/

const bindEventHandler = (element: Element, key: string, handler: EventHandler<Event>) => {
  const eventType = camelToKebab(key.slice(2))
  return () => on(element, eventType, isEventSource(handler) ? handler.dispatchEvent : handler)
}

const bindProp = (
  element: Element,
  key: string,
  value: unknown,
  meta?: StickBuilder
) => {
  const needsReflect = !meta || key in meta.reflect
  let mount

  if (needsReflect) {
    if (isObservable(value)) {
      mount = () => value((nextValue) => setAttr(element, key, nextValue as Displayed))
    } else {
      setAttr(element, key, value as Displayed)
    }
  }

  if (meta) {
    let propValue = value

    if (isObservable(propValue)) {
      propValue = isBroadcast(value) ? value : broadcast(value as O<unknown>)
    }

    // @ts-expect-error
    if (!element.props) element.props = {}
    // @ts-expect-error
    // We don't know what element we actually dealing with here
    // All the typechecking will happen in the template
    element.props[key] = propValue
  }

  return mount
}

const createRoot = (tag: Renderable): DocumentFragment | HTMLElement => {
  if (tag === Fragment) return createFragment()
  return createElement(typeof tag === 'string' ? tag : tag[stickKey].tagName)
}

export const jsx: Renderer = (tag: Renderable, props: AnyProps) => {
  const element = createRoot(tag)
  const { children, ...properties } = props
  const mountFns: (() => () => void)[] = []

  for (const [key, value] of Object.entries(properties)) {
    if (key.startsWith('_')) continue
    else if (eventHandlerKey.test(key)) {
      mountFns.push(bindEventHandler(element as HTMLElement, key, value))
    } else {
      bindProp(element as HTMLElement, key, value, Reflect.get(element, stickKey))
    }
  }

  if (children) {
    const c = Array.isArray(children) && !isRenderResult(children) ? children : [children]

    for (const child of c) {
      let childElement: Maybe<Node>

      if (isRenderResult(child)) {
        const [rootElement, mount] = child
        childElement = rootElement
        if (mount) mountFns.push(mount)
      } else if (isObservable(child)) {
        const textNode = createTextNode('')
        mountFns.push(() => child((value) => {
          textNode.data = toString(value as Displayed)
        }))
        childElement = textNode
      } else {
        childElement = createTextNode(toString(child))
      }

      if (childElement) {
        element.append(childElement)
      }
    }
  }

  return renderResult(element, () => {
    const unmountFns = mountFns.map((init) => init())

    return () => unmountFns.forEach((unmount) => unmount())
  })
}

export const jsxs = jsx

export { Fragment }
