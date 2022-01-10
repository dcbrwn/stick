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
  let visibleCount = 0

  const createItems = (itemsToCreate: number): void => {
    for (let i = 0; i < itemsToCreate; i += 1) {
      withRenderingContext(() => {
        const [observe, notify] = observable<ItemType>()
        const element = renderer(broadcast(observe), items.length)
        items.push({ element: ensureElement(element), notify, mount: getMount() })
      })
    }
  }

  const expand = (itemsToAppend: number): void => {
    const cachedItems = Math.min(itemsToAppend, items.length - visibleCount)
    const itemsToCreate = itemsToAppend - cachedItems

    createItems(itemsToCreate)

    for (let i = visibleCount, len = visibleCount + itemsToAppend; i < len; i += 1) {
      const item = items[i]
      container.appendChild(item.element)
      if (item.mount) item.unmount = item.mount()
    }

    visibleCount += itemsToAppend
  }

  const shrink = (itemsToRemove: number): void => {
    const oldVisibleCount = visibleCount
    visibleCount -= itemsToRemove

    for (let i = oldVisibleCount; i > visibleCount; i -= 1) {
      const item = items[i - 1]
      item.unmount!()
      item.unmount = undefined
      container.removeChild(item.element)
    }
  }

  const notifyVisibleChildren = <ItemType> (items: Item<ItemType>[], collection: ItemType[]) => {
    for (let i = 0, len = collection.length; i < len; i += 1) {
      items[i].notify(collection[i])
    }
  }

  const handleCollectionUpdates = (collection: ItemType[]) => {
    const difference = collection.length - visibleCount

    if (difference > 0) {
      expand(difference)
    } else if (difference < 0) {
      shrink(-difference)
    }

    notifyVisibleChildren(items, collection)
  }

  const mountVisibleItems = () => {
    for (let i = 0; i < visibleCount; i += 1) {
      const item = items[i]
      if (item.mount) item.unmount = item.mount()
    }
  }

  const unmountVisibleItems = () => {
    for (let i = 0, len = visibleCount; i < len; i += 1) {
      items[i].unmount!()
    }
  }

  onMount(() => {
    mountVisibleItems()
    const forgetCollection = observe(handleCollectionUpdates)

    return () => {
      forgetCollection()
      unmountVisibleItems()
    }
  })

  return container
}

export { repeat }
