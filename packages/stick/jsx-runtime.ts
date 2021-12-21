import { Renderable, Renderer, stickKey } from './definitions'

export namespace JSX {
  export interface IntrinsicElements {
    [tagName: string]: {
      children?: Renderer[]
    }
  }
}

export function jsx (tag: Renderable, props: Record<string, any>): Renderer {
  const tagName = typeof tag === 'string' ? tag : tag[stickKey].tagName

  return (parent: Element) => {
    const element = document.createElement(tagName)
    const { children, ...properties } = props
    Object.assign(element, properties)
    console.log('chld', children)
    if (children) {
      const c = Array.isArray(children) ? children : [children]

      for (const child of c) {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child))
        } else if (typeof child === 'function') {
          child(element)
        }
      }
    }
    parent.appendChild(element)
  }
}

export const jsxs = jsx
