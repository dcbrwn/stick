import { renderResult, RenderResult } from './definitions'
import { O } from './o'

export function match<T> (observe: O<T>, renderer: (value: T) => RenderResult): RenderResult {
  const cache = new Map<T, RenderResult>()
  const anchor = document.createElement('div')
  let detach: VoidFunction | undefined

  return renderResult(anchor, () => {
    const forget = observe((value) => {
      if (detach) detach()

      let next = cache.get(value)

      if (!next) {
        next = renderer(value)
        cache.set(value, next)
      }

      const [element, attach] = next

      if (element) {
        anchor.replaceChildren(element)
      } else {
        anchor.innerHTML = ''
      }

      if (attach) detach = attach()
    })

    return () => {
      if (detach) detach()
      forget()
    }
  })
}
