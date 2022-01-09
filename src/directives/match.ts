import { onMount, getMount, withRenderingContext } from '../context'
import { Maybe, Nothing, RenderResult } from '../definitions'
import { createContainer, ensureElement } from '../dom'
import { O } from '../o'

const match = <T> (observe: O<T>, renderer: (value: T) => RenderResult): RenderResult => {
  const cache = new Map<T, [HTMLElement, Maybe<() => () => void>]>()
  const isEqual = (a: Maybe<T>, b: T): boolean => a === b
  let lastValue: Maybe<T>
  let unmount: VoidFunction | Nothing
  let currentElement: HTMLElement = createContainer()

  const renderValue = (value: T) => {
    if (unmount) unmount()

    let next = cache.get(value)

    if (!next) {
      withRenderingContext(() => {
        const rootElement = renderer(value)
        next = [ensureElement(rootElement), getMount()]
        cache.set(value, next)
      })
    }

    const [element, mount] = next!

    currentElement.replaceWith(element!)
    currentElement = element!

    if (mount) unmount = mount()
  }

  onMount(() => {
    const forget = observe((value) => {
      if (!isEqual(lastValue, value)) {
        renderValue(value)
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
