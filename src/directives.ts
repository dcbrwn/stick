import { renderResult, RenderResult } from './definitions'
import { O } from './o'

export function match<T> (observe: O<T>, renderer: (value: T) => RenderResult): RenderResult {
  const cache = new Map<T, RenderResult>()
  const anchor = document.createElement('div')
  let unmount: VoidFunction | undefined

  return renderResult(anchor, () => {
    const forget = observe((value) => {
      if (unmount) unmount()

      let next = cache.get(value)

      if (!next) {
        next = renderer(value)
        cache.set(value, next)
      }

      const [element, mount] = next

      if (element) {
        anchor.replaceChildren(element)
      } else {
        anchor.innerHTML = ''
      }

      if (mount) unmount = mount()
    })

    return () => {
      if (unmount) unmount()
      forget()
    }
  })
}
