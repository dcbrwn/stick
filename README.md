# Stick

This is a POC implementation of a rendering library with following goals:
- Simple API with as few layers of indirection as possible. One should easily be able to grasp how the thing works
- Fine-grained DOM updates, without intermediate layers like VirtualDOM
- Decent perceptible performance and low memory footprint
- Embrace the platform. Particularly WebComponents and default devtools, which already exist in browsers

## Example

```tsx
import { element } from 'stick'
import { O, fromEvent } from 'stick/o'

// element() creates a WebComponent, custom HTML tag, that can be used as a regular HTML element.
const CoordsViewer = element('x-coords', (props: { coords: O<[number, number]> }) => {
  // This function is called only once, when element is constructed.

  // Decompose the observable with coordinates
  const x = props.coords.map(v => v[0])
  const y = props.coords.map(v => v[1])

  // Render the DOM. JSX here actually renders DOM nodes and remembers places, that need dynamic updates.
  return <span>({x}, {y})</span>
})

element('x-app', () => {
  const mouseCoords = fromEvent<MouseEvent>(document, 'mousemove')
    .map((event): [number, number] => [event.pageX, event.pageY])

  return <main>
    <h1>A somewhat lacking example</h1>
    <p>Mouse is at: <CoordsViewer coords={mouseCoords} /></p>
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