import { Renderable, Renderer, stickKey, RenderResult } from './definitions'
import { O } from './o'

type Displayed = string | {
  toString(): string;
}

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

function toString (value: Displayed): string {
  return typeof value === 'string' ? value : value.toString()
}

export const jsx: Renderer = (tag: Renderable, props: Record<string, any>) => {
  const tagName = typeof tag === 'string' ? tag : tag[stickKey].tagName

  const element = document.createElement(tagName)
  const { children, ref, ...properties } = props
  const attachFns: (() => () => void)[] = []

  const setValue = (key: string, newValue: Displayed) => {
    if (typeof newValue === 'boolean') {
      element.toggleAttribute(key, newValue)
    } else {
      element.setAttribute(key, toString(newValue))
    }
  }

  for (const [key, value] of Object.entries(properties)) {
    if (key.startsWith('_')) continue

    const isBuiltin = typeof tag === 'string'
    const needsReflect = isBuiltin || key in tag[stickKey].reflect

    if (needsReflect) {
      if (value instanceof O) {
        attachFns.push(() => value.subscribe((nextValue) => setValue(key, nextValue)))
      } else {
        setValue(key, value)
      }
    }

    if (!isBuiltin) {
      // @ts-expect-error
      // We don't know what element we actually dealing with here
      // All the typechecking will happen in the template
      element[key] = value
    }
  }

  if (children) {
    const c = Array.isArray(children) ? children : [children]

    for (const child of c.flat()) {
      let childElement: Node | null = null

      if (child instanceof RenderResult) {
        childElement = child.rootElement
        if (child.attach) attachFns.push(child.attach)
      } else if (child instanceof O) {
        const textNode = document.createTextNode('')
        attachFns.push(() => child.subscribe((value) => {
          textNode.data = value
        }))
        childElement = textNode
      } else {
        childElement = document.createTextNode(String(child))
      }

      if (childElement) {
        element.append(childElement)
      }
    }
  }

  return new RenderResult(element, () => {
    const detachFns = attachFns.map((init) => init())

    return () => {
      for (const detach of detachFns) {
        detach()
      }
    }
  })
}

export const jsxs = jsx
