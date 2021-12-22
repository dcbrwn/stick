# Stick

This is a POC implementation of a rendering library with following goals:
- Simple API with as few layers of indirection as possible. One should easily be able to grasp how the thing works
- Fine-grained DOM updates, without intermediate layers like VirtualDOM
- Decent perceptable performance and low memory footprint
- Embrace the platform. Particularly WebComponents and default devtools, which already exist in browsers

## TODO

- Event management
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