import { Renderable, Renderer, stickKey, RenderResult } from './definitions'
import { O } from './o'

export namespace JSX {
  type Displayed = string | {
    toString(): string;
  }

  type AttrValue<T> = T | O<T>

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

export const jsx: Renderer = (tag: Renderable, props: Record<string, any>) => {
  const tagName = typeof tag === 'string' ? tag : tag[stickKey].tagName

  const element = document.createElement(tagName)
  const { children, ref, ...properties } = props
  const inits: (() => () => void)[] = []

  const setValue = (key: string, newValue: unknown) => {
    if (typeof newValue === 'boolean') {
      element.toggleAttribute(key, newValue)
    } else {
      element.setAttribute(key, String(newValue))
    }
  }

  for (const [key, value] of Object.entries(properties)) {
    if (key.startsWith('_')) continue

    const isBuiltin = typeof tag === 'string'
    const needsReflect = isBuiltin || key in tag[stickKey].reflect

    if (needsReflect) {
      if (value instanceof O) {
        inits.push(() => value.subscribe((nextValue) => setValue(key, nextValue)))
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
        if (child.init) inits.push(child.init)
      } else if (child instanceof O) {
        const span = document.createElement('s-bind')
        inits.push(() => child.subscribe((value) => {
          span.innerText = value
        }))
        childElement = span
      } else {
        childElement = document.createTextNode(String(child))
      }

      if (childElement) {
        element.append(childElement)
      }
    }
  }

  return new RenderResult(element, () => {
    const deinits = inits.map((init) => init())

    return () => {
      for (const deinit of deinits) {
        deinit()
      }
    }
  })
}

function defineBuiltins () {
  class DummyElement extends HTMLElement {}
  customElements.define('s-bind', DummyElement)
}

defineBuiltins()

export const jsxs = jsx
