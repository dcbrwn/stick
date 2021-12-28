import { renderResult, RenderResult } from './definitions'
import { createContainer } from './dom'
import { O } from './o'

export const match = <T> (observe: O<T>, renderer: (value: T) => RenderResult): RenderResult => {
  const cache = new Map<T, [Element, (() => () => void) | null]>()
  let unmount: VoidFunction | undefined
  let currentElement: Element = createContainer()

  return renderResult(currentElement, () => {
    const forget = observe((value) => {
      if (unmount) unmount()

      let next = cache.get(value)

      if (!next) {
        const [rootElement, mount] = renderer(value)
        let result
        if (rootElement instanceof DocumentFragment) {
          result = createContainer()
          result.appendChild(rootElement)
        } else if (rootElement instanceof Node) {
          result = rootElement
        } else {
          result = createContainer()
        }

        next = [result, mount]
        cache.set(value, next)
      }

      const [element, mount] = next

      currentElement.replaceWith(element!)
      currentElement = element!

      if (mount) unmount = mount()
    })

    return () => {
      if (unmount) unmount()
      forget()
    }
  })
}

// Can't find anything like this in lib.d.ts :(
type ItemType<T> = T extends (infer Item)[] ? Item : never

export const repeat = <T extends unknown[]> (observe: O<T>, renderer: (value: ItemType<T>) => RenderResult): RenderResult => {
  const container = createContainer()
  const cache = new Map<T, [Element, (() => () => void) | null]>()

  return renderResult(container, () => {
    const forget = observe((collection) => {
      // TODO: We need a way to render the template only once and reuse
    })

    return () => {
      forget()
    }
  })
}
