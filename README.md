# Stick

This is a POC implementation of a rendering library with following goals:
- Simple API with as few layers of indirection as possible. One should easily be able to grasp how the thing works
- Fine-grained DOM updates, without intermediate layers like VirtualDOM
- Decent perceptible performance and low memory footprint
- Embrace the platform. Particularly WebComponents and default devtools, which already exist in browsers

## Example

```tsx
import { element } from 'stick'
import { O, fromEvent, map } from 'stick/o'


// element() creates a WebComponent, custom HTML tag, that can be used as a regular HTML element.
const CoordsViewer = element('x-coords', (props: { coords: O<[number, number]> }) => {
  // This function is called only once, when element is constructed.

  // Decompose the observable with coordinates
  const x = map(props.coords, v => v[0])
  const y = map(props.coords, v => v[1])

  // Render the DOM. JSX here actually renders DOM nodes and remembers places, that need dynamic updates.
  return <span>({x}, {y})</span>
})


const Counter = element('x-counter', (props: { init: number }) => {
  // Event sources, are observables that can be used as event handlers in JSX templates
  const inc$ = eventSource(() => 1)
  const dec$ = eventSource(() => -1)

  const count = pipe(
    merge(fromArray([0]), inc$, dec$),
    scan((counter, change) => counter + change, props.init)
  )

  return <>
    Count <button onClick={inc$}>inc</button> <button onClick={dec$}>dec</button>: {count}
  </>
})


// Root component of this example
// Insert it as <x-app></x-app> in DOM somewhere, and it will render itself
element('x-app', () => {
  const mouseCoords = map(
    fromEvent<MouseEvent>(document, 'mousemove'),
    (event): [number, number] => [event.pageX, event.pageY]
  )

  return <main>
    <h1>A somewhat lacking example</h1>
    <p>Mouse is at: <CoordsViewer coords={mouseCoords} /></p>
    <p><Counter init={9000} /></p>
  </main>
})
```

## TODO

- Conditional rendering
- Observable collection rendering
- Refine API
- Cover the API with tests
- Proper styling support
- Shadow DOM
- RxJS and Mostjs interop
- docs
- Async renderer
- SSR