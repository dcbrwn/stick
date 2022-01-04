import { O, Observer } from './o'
import { Maybe } from './definitions'
import { noop } from './util'

type RenderingContext = {
  mountFns: (() => Maybe<VoidFunction>)[]
}

const contextStack: RenderingContext[] = []
let currentContext: Maybe<RenderingContext>

const createRenderingContext = (): RenderingContext => {
  return {
    mountFns: []
  }
}

const withRenderingContext = (fn: VoidFunction) => {
  const ctx = createRenderingContext()
  currentContext = ctx
  contextStack.push(ctx)
  fn()
  contextStack.pop()
  currentContext = contextStack[contextStack.length - 1]
  return ctx
}

const getRenderingContext = (): RenderingContext => {
  if (!currentContext) throw new Error('Outside of rendering context')
  return currentContext
}

const onMount = (fn: () => Maybe<VoidFunction>) => {
  getRenderingContext().mountFns.push(fn)
}

const observe = <T> (observable: O<T>, observer: Observer<T> = noop): void => {
  onMount(() => observable(observer))
}

const getMount = () => {
  const ctx = getRenderingContext()

  return () => {
    const unmountFns = ctx.mountFns.reduce<VoidFunction[]>((memo, mount) => {
      const unmount = mount()
      if (unmount) memo.push(unmount)
      return memo
    }, [])

    return () => unmountFns.forEach((unmount) => unmount())
  }
}

export {
  type RenderingContext,
  withRenderingContext,
  onMount,
  observe,
  getMount
}
