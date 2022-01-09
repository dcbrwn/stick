import { onMount, render } from '../context'
import { Maybe, Nothing, RenderResult } from '../definitions'
import { createContainer, ensureElement } from '../dom'
import { O } from '../o'

type CacheEntry = [HTMLElement, Maybe<() => () => void>]

const match = <T> (
  observe: O<T>,
  renderer: (value: T) => RenderResult,
  isEqual = (a: Maybe<T>, b: T): boolean => a === b
): RenderResult => {
  const cache = new Map<T, CacheEntry>()
  let lastValue: Maybe<T>
  let unmount: VoidFunction | Nothing
  let currentElement: HTMLElement = createContainer()

  const createCacheEntry = (value: T): CacheEntry => {
    const [element, ctx] = render(() => renderer(value))
    const entry: CacheEntry = [ensureElement(element), () => ctx.mount()]
    cache.set(value, entry)
    return entry
  }

  const updateContents = (value: T) => {
    if (unmount) unmount()

    const [element, mount] = cache.get(value) || createCacheEntry(value)

    currentElement.replaceWith(element!)
    currentElement = element!

    if (mount) unmount = mount()
  }

  onMount(() => {
    const forget = observe((value) => {
      if (!isEqual(lastValue, value)) {
        updateContents(value)
      }
    })

    return () => {
      if (unmount) unmount()
      forget()
    }
  })

  return currentElement
}

export { match }
