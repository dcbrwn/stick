import { Renderable, Renderer, stickKey, isRenderResult, renderResult, AnyProps, Displayed, Fragment, StickBuilder } from './definitions'
import { createElement, on, setAttr, createTextNode, createFragment } from './dom'
import { fromEvent, isObservable, isThunk, O, Thunk } from './o'
import { camelToKebab, toString } from './util'

type AttrValue<T> = T | O<T>

type EventHandler<E extends Event> = ((event: E) => boolean | undefined | void) | Thunk<E, void>

export namespace JSX {
  interface ElementProps {
    children?: (string | O<any> | Renderer)[]
  }

  interface HTMLAttributes extends ElementProps {
    // TODO: Steal proper typings from preact:
    // https://github.com/preactjs/preact/blob/9d761c56bafc77be48780885391dd6f72ba23359/src/jsx.d.ts#L622
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

  if (isThunk(handler)) {
    return () => handler(fromEvent(element, eventType))(/* subscribe for side effects */)
  } else {
    const eventHandler = handler as (event: Event) => boolean
    return () => on(element, eventType, eventHandler)
  }
}

const bindProp = (
  element: Element,
  key: string,
  value: unknown,
  meta?: StickBuilder
) => {
  const needsReflect = !meta || key in meta.reflect
  let attach

  if (needsReflect) {
    if (isObservable(value)) {
      attach = () => value((nextValue) => setAttr(element, key, nextValue as Displayed))
    } else {
      setAttr(element, key, value as Displayed)
    }
  }

  if (meta) {
    // @ts-expect-error
    if (!element.props) element.props = {}
    // @ts-expect-error
    // We don't know what element we actually dealing with here
    // All the typechecking will happen in the template
    element.props[key] = value
  }

  return attach
}

const createRoot = (tag: Renderable): DocumentFragment | HTMLElement => {
  if (tag === Fragment) return createFragment()
  return createElement(typeof tag === 'string' ? tag : tag[stickKey].tagName)
}

export const jsx: Renderer = (tag: Renderable, props: AnyProps) => {
  const element = createRoot(tag)
  const { children, ...properties } = props
  const attachFns: (() => () => void)[] = []

  for (const [key, value] of Object.entries(properties)) {
    if (key.startsWith('_')) continue
    else if (eventHandlerKey.test(key)) {
      attachFns.push(bindEventHandler(element as HTMLElement, key, value))
    } else {
      bindProp(element as HTMLElement, key, value, Reflect.get(element, stickKey))
    }
  }

  if (children) {
    const c = Array.isArray(children) && !isRenderResult(children) ? children : [children]

    for (const child of c) {
      let childElement: Node | null = null

      if (isRenderResult(child)) {
        const [rootElement, attach] = child
        childElement = rootElement
        if (attach) attachFns.push(attach)
      } else if (isObservable(child)) {
        const textNode = createTextNode('')
        attachFns.push(() => child((value) => {
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
    const detachFns = attachFns.map((init) => init())

    return () => detachFns.forEach((detach) => detach())
  })
}

export const jsxs = jsx

export { Fragment }
