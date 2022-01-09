import { O, observable, Observer, broadcast } from './o'
import { createTag } from './util'
import { Maybe } from './definitions'

type Inlet<T> = O<T> & {
  observer$: O<Maybe<Observer<T>>>
}

const [tagInlet, isInlet] = createTag<Inlet<unknown>>()

const inlet = <T> (): Inlet<T> => {
  const [observer$, notifyObserved] = observable<Maybe<Observer<T>>>()
  const inlet = broadcast((notify: Observer<T>): (() => void) => {
    notifyObserved(notify)
    return () => notifyObserved(null)
  }) as Inlet<any>
  inlet.observer$ = broadcast(observer$)

  return tagInlet(inlet)
}

const intoInlet = <T> (inlet: Inlet<T>, input: O<T>) => {
  let forget: Maybe<VoidFunction>
  inlet.observer$((notifyInlet: Maybe<Observer<T>>) => {
    if (notifyInlet) {
      forget = input((value) => notifyInlet(value))
    } else if (forget) {
      forget()
    }
  })

  return () => {
    if (forget) forget()
  }
}

export {
  type Inlet,
  isInlet,
  inlet,
  intoInlet
}
