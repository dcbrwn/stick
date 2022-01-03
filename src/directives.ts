import { Maybe, Nothing, renderResult, RenderResult } from './definitions'
import { createContainer } from './dom'
import { O, observable } from './o'

const ensureElement = (element: Maybe<DocumentFragment | Element>): Element => {
  let result
  if (element instanceof DocumentFragment) {
    result = createContainer()
    result.appendChild(element)
  } else if (element instanceof Element) {
    result = element
  } else {
    result = createContainer()
  }

  return result
}

const match = <T> (observe: O<T>, renderer: (value: T) => RenderResult): RenderResult => {
  const cache = new Map<T, [Element, Maybe<() => () => void>]>()
  let unmount: VoidFunction | Nothing
  let currentElement: Element = createContainer()

  return renderResult(currentElement, () => {
    const forget = observe((value) => {
      if (unmount) unmount()

      let next = cache.get(value)

      if (!next) {
        const [rootElement, mount] = renderer(value)
        next = [ensureElement(rootElement), mount]
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

const repeat = <ItemType> (
  observe: O<ItemType[]>,
  renderer: (value: O<ItemType>) => RenderResult
): RenderResult => {
  type Item = {
    notify: (item: ItemType) => void,
    element: Element,
    mount: (() => () => void) | Nothing,
    unmount?: () => void,
  }
  const container = createContainer()
  const items: Item[] = []
  let visibleItems = 0

  return renderResult(container, () => {
    const forget = observe((collection) => {
      const newLength = collection.length
      const difference = newLength - visibleItems

      if (difference < 0) {
        for (let i = newLength, len = items.length; i < len; i += 1) {
          const item = items[i]
          item.unmount?.()
          item.unmount = undefined
          item.element.remove()
        }
      } else if (difference > 0) {
        const cachedItems = Math.min(difference, items.length - visibleItems)
        const itemsToCreate = difference - cachedItems

        if (itemsToCreate > 0) {
          for (let i = 0; i < itemsToCreate; i += 1) {
            const [observe, notify] = observable<ItemType>()
            const [element, mount] = renderer(observe)
            items.push({ element: ensureElement(element), notify, mount })
          }
        }

        for (let i = visibleItems, len = newLength; i < len; i += 1) {
          const item = items[i]
          container.appendChild(item.element)
          if (item.mount) item.unmount = item.mount()
        }
      }

      visibleItems = newLength

      for (let i = 0, len = visibleItems; i < len; i += 1) {
        items[i].notify(collection[i])
      }
    })

    return () => {
      for (let i = 0, len = visibleItems; i < len; i += 1) {
        items[i].unmount?.()
      }
      forget()
    }
  })
}

export {
  match,
  repeat
}
