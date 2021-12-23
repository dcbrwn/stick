import { element } from 'stick'
import { O, fromEvent, map, throttle, thunk } from 'stick/o'

const VectorView = element('x-vector', (props: { x: O<number>, y: O<number> }) => {
  return <span title={props.x}>({props.x}, {props.y})</span>
})

const TestElement = element('x-update-perf', (props: { cols: number, rows: number }) => {
  // const timer = createTimer()
  const mouseMove = throttle(fromEvent<MouseEvent>(document, 'mousemove'))

  const body = []
  for (let i = 0; i < props.rows; i += 1) {
    for (let j = 0; j < props.cols; j += 1) {
      const x = map(mouseMove, (event) => event.pageX * i)
      const y = map(mouseMove, (event) => event.pageY * j)

      // const value = timer.map((time) => time * i * j)
      const style = `
        position: absolute;
        contain: strict;
        isolation: isolate;
        pointer-events: none;
        top: 0;
        left: 0;
        width: 100px;
        height: 30px;
        transform: translate(${j * 100}px, ${i * 30}px);
        overflow: hidden;
        white-space: nowrap;
      `

      body.push(<div style={style}>
        <VectorView x={x} y={y} />
      </div>)
    }
  }

  return <div style="position: relative; font-family: monospace">{body}</div>
})

element('x-app', () => {
  const fnHandler = () => console.log('Handled in callback')

  const thunkHandler = thunk((events) => {
    return map(events, () => console.log('Handled with observables'))
  })

  return <div>
    <h1>Testbed</h1>
    <p>
      Event handlers: <button onClick={fnHandler}>Callback</button> <button onClick={thunkHandler}>Observer</button>
    </p>
    <TestElement cols={10} rows={100} />
  </div>
})
