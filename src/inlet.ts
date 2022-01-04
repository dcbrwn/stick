import { O } from './o'
import { observable } from './o/observable'
import { createTag } from './util'

type Inlet<T> = O<T> & {
  notify(event: T): unknown;
}

const [tagInlet, isInlet] = createTag<Inlet<unknown>>()

const inlet = <T> (): Inlet<T> => {
  const [observe, notify] = observable<T>()
  const inlet = observe as Inlet<T>
  inlet.notify = notify as unknown as ((event: T) => void)
  return tagInlet(inlet)
}

export {
  type Inlet,
  isInlet,
  inlet
}
