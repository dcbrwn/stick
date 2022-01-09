import { onMount, getMount, withRenderingContext } from '../context'
import { Nothing, RenderResult } from '../definitions'
import { createContainer, ensureElement } from '../dom'
import { broadcast, O, observable } from '../o'

type Item<T> = {
  notify: (item: T) => void,
  element: Element,
  mount: (() => () => void) | Nothing,
  unmount?: () => void,
}

const repeat = <ItemType> (
  observe: O<ItemType[]>,
  renderer: (value: O<ItemType>, index: number) => RenderResult
): RenderResult => {
  const container = createContainer()
  const items: Item<ItemType>[] = []
  let visibleItems = 0

  const appendItems = (itemsToAppend: number): void => {
    const cachedItems = Math.min(itemsToAppend, items.length - visibleItems)
    const itemsToCreate = itemsToAppend - cachedItems

    if (itemsToCreate > 0) {
      for (let i = 0; i < itemsToCreate; i += 1) {
        withRenderingContext(() => {
          const [observe, notify] = observable<ItemType>()
          const element = renderer(broadcast(observe), items.length)
          items.push({ element: ensureElement(element), notify, mount: getMount() })
        })
      }
    }

    for (let i = visibleItems, len = visibleItems + itemsToAppend; i < len; i += 1) {
      const item = items[i]
      container.appendChild(item.element)
      if (item.mount) item.unmount = item.mount()
    }

    visibleItems += itemsToAppend
  }

  const removeItems = (itemsToRemove: number): void => {
    visibleItems -= itemsToRemove

    for (let i = visibleItems, len = items.length; i < len; i += 1) {
      const item = items[i]
      if (item.unmount) {
        item.unmount()
        item.unmount = undefined
        container.removeChild(item.element)
      }
    }
  }

  const notifyVisibleChildren = <ItemType> (items: Item<ItemType>[], collection: ItemType[]) => {
    for (let i = 0, len = collection.length; i < len; i += 1) {
      items[i].notify(collection[i])
    }
  }

  onMount(() => {
    for (let i = 0; i < visibleItems; i += 1) {
      const item = items[i]

      if (item.mount) item.unmount = item.mount()
    }

    const unmount = observe((collection) => {
      const difference = collection.length - visibleItems

      if (difference > 0) {
        appendItems(difference)
      } else if (difference < 0) {
        removeItems(-difference)
      }

      notifyVisibleChildren(items, collection)
    })

    return () => {
      for (let i = 0, len = visibleItems; i < len; i += 1) {
        items[i].unmount?.()
      }
      unmount()
    }
  })

  return container
}

export { repeat }
