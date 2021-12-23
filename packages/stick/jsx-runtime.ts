import { Renderable, Renderer, stickKey, isRenderResult, renderResult, AnyProps, Displayed } from './definitions'
import { createElement, on, setAttr, createTextNode } from './dom'
import { fromEvent, isObservable, isThunk, O, Thunk } from './o'
import { camelToKebab, toString } from './util'

type AttrValue<T> = T | O<T>

export namespace JSX {
  interface ElementProps {
    children?: (string | O<any> | Renderer)[]
  }

  interface HTMLAttributes extends ElementProps {
    // TODO: Steal proper typings from preact:
    // https://github.com/preactjs/preact/blob/9d761c56bafc77be48780885391dd6f72ba23359/src/jsx.d.ts#L622
    title?: AttrValue<Displayed>
    style?: AttrValue<Displayed>
  }

  export interface IntrinsicElements {
    [tagName: string]: HTMLAttributes
  }
}

const eventHandlerKey = /^on[A-Z]/

export const jsx: Renderer = (tag: Renderable, props: AnyProps) => {
  const isBuiltin = typeof tag === 'string'
  const tagName = isBuiltin ? tag : tag[stickKey].tagName

  const element = createElement(tagName)
  const { children, ...properties } = props
  const attachFns: (() => () => void)[] = []

  const setProp = (key: string, value: unknown) => {
    const needsReflect = isBuiltin || key in tag[stickKey].reflect

    if (needsReflect) {
      if (isObservable(value)) {
        attachFns.push(() => value((nextValue) => setAttr(element, key, nextValue as Displayed)))
      } else {
        setAttr(element, key, value as Displayed)
      }
    }

    if (!isBuiltin) {
      // @ts-expect-error
      // We don't know what element we actually dealing with here
      // All the typechecking will happen in the template
      element.props[key] = value
    }
  }

  const setEvent = (key: string, handler: ((event: Event) => boolean) | Thunk<Event, unknown>) => {
    const eventType = camelToKebab(key.slice(2))

    if (isThunk(handler)) {
      attachFns.push(() => handler(fromEvent(element, eventType))(/* subscribe for side effects */))
    } else {
      const eventHandler = handler as (event: Event) => boolean

      attachFns.push(() => on(element, eventType, eventHandler))
    }
  }

  if (!isBuiltin) {
    // @ts-expect-error
    element.props = {}
  }

  for (const [key, value] of Object.entries(properties)) {
    if (key.startsWith('_')) continue
    else if (eventHandlerKey.test(key)) setEvent(key, value)
    else setProp(key, value)
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
