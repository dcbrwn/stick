import { O, tagObservable, observable, Observer } from './o'
import { createTag } from './util'
import { Maybe } from './definitions'

type Inlet<T> = O<T> & {
  observer$: O<Maybe<Observer<T>>>
}

const [tagInlet, isInlet] = createTag<Inlet<unknown>>()

const inlet = <T> (): Inlet<T> => {
  const [observer$, notifyObserved] = observable<Maybe<Observer<T>>>()
  const inlet = (notify: Observer<T>): (() => void) => {
    notifyObserved(notify)
    return () => notifyObserved(null)
  }
  inlet.observer$ = observer$

  return tagObservable(tagInlet<Inlet<any>>(inlet))
}

const intoInlet = <T> (input: O<T>, inlet: Inlet<T>) => {
  let forget: Maybe<VoidFunction>
  inlet.observer$((notifyInlet: Maybe<Observer<T>>) => {
    if (notifyInlet) {
      forget = input((value) => notifyInlet(value))
    } else if (forget) {
      forget()
    }
  })
}

export {
  type Inlet,
  isInlet,
  inlet,
  intoInlet
}
