import { Renderable, Renderer, stickKey, RenderResult } from './definitions'
import { O } from './o'

export namespace JSX {
  export interface IntrinsicElements {
    [tagName: string]: {
      children?: Renderer[]
    }
  }
}

export const jsx: Renderer = (tag: Renderable, props: Record<string, any>) => {
  const tagName = typeof tag === 'string' ? tag : tag[stickKey].tagName

  const element = document.createElement(tagName)
  const { children, ref, ...properties } = props
  const inits: (() => () => void)[] = []

  Object.assign(element, properties)

  if (children) {
    const c = Array.isArray(children) ? children : [children]

    for (const child of c) {
      let childElement: Node | null = null

      if (typeof child === 'string') {
        childElement = document.createTextNode(child)
      } else if (child instanceof RenderResult) {
        childElement = child.rootElement
        if (child.init) inits.push(child.init)
      } else if (child instanceof O) {
        const span = document.createElement('span')
        inits.push(() => child.subscribe((value) => {
          span.innerText = value
        }))
        childElement = span
      }

      if (childElement) {
        element.append(childElement)
      }
    }
  }

  return new RenderResult(
    element,
    () => {
      const deinits = inits.map((init) => init())

      return () => {
        for (const deinit of deinits) {
          deinit()
        }
      }
    }
  )
}

export const jsxs = jsx
