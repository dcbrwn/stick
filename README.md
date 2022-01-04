# Stick

This is a POC implementation of a rendering library with following goals:
- Simple API with as few layers of indirection as possible. One should easily be able to grasp how the thing works
- Fine-grained DOM updates, without intermediate layers like VirtualDOM
- Decent perceptible performance and low memory footprint
- Embrace the platform. Particularly WebComponents and default devtools, which already exist in browsers

## Example

```tsx
import { element, Inlet, inlet, intoInlet } from '@stickts/stick'
import { O, fromEvent, map } from '@stickts/stick/o'

// element() creates a WebComponent, custom HTML tag, that can be used as a regular HTML element.
const Counter = element<{
  init: number,
  count$: Inlet<number>
}>('x-counter', (props) => {
  // This function is called only once, when element is constructed.

  // "inlets" are special kind of observables that can be used to consume values produced elsewere.
  // These ones consume events and can be passed as event handlers to the template
  const inc$ = inlet<MouseEvent>()
  const dec$ = inlet<MouseEvent>()

  const count = pipe(
    merge(
      fromArray([0]),
      map(1)(inc$),
      map(-1)(dec$)
    ),
    scan((counter, change) => counter + change, props.init),
  )

  // This function connects `count` observable with inlet `props.count$`
  // This way observing `props.count$` actually leads to observing `count`
  intoInlet(count, props.count$)

  // Render the DOM. JSX here actually renders DOM nodes and remembers places, that need dynamic updates.
  return <>
    <button onClick={inc$}>inc</button> <button onClick={dec$}>dec</button>
  </>
})


// Root component of this example
// Insert it as <x-app></x-app> in DOM somewhere, and it will render itself
element('x-app', () => {
  const count$ = inlet<number>()

  return <main>
    <h1>A somewhat lacking example</h1>
    <p>
      <Counter init={9000} count$={count$}/>

      Current count is: {count$}
    </p>
  </main>
})
```

## Caveats

- `match` and `repeat` directives, render into `<s-container>` element. This gives us an ability to easily and cheaply swap rendered content and cache it. The container has `display: contents` so it's not represented in the render tree. The problem is that this interferes with flex/grid layouts and CSS selectors.

## TODO

- Refine API
- Cover the API with tests
- Proper styling support
- Shadow DOM
- RxJS and Mostjs interop
- docs
- Async renderer
- SSR

## Links

- https://html.spec.whatwg.org/multipage/custom-elements.html
