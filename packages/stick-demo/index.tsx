import { element } from 'stick'
import { O, fromEvent, map, throttle, observable, merge, reduce, fromArray, pipe } from 'stick/o'
import './bench'

const VectorView = element('x-vector', (props: { x: O<number>, y: O<number> }) => {
  return <span title={props.x}>({props.x}, {props.y})</span>
})

const TestElement = element('x-update-perf', (props: { cols: number, rows: number }) => {
  // const timer = createTimer()
  const mouseMove = throttle(fromEvent<MouseEvent>(document, 'mousemove'))

  const body = []
  for (let i = 0; i < props.rows; i += 1) {
    for (let j = 0; j < props.cols; j += 1) {
      const x = pipe(mouseMove, map((event) => event.pageX * i))
      const y = pipe(mouseMove, map((event) => event.pageY * j))

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

const Counter = element('x-counter', () => {
  const [inc$, handleInc] = observable()
  const [dec$, handleDec] = observable()

  const count = pipe(
    merge(
      fromArray([0]),
      map(() => 1)(inc$),
      map(() => -1)(dec$)
    ),
    reduce((counter, change: number) => counter + change, 0)
  )

  return <>
    Count <button onClick={handleInc}>inc</button> <button onClick={handleDec}>dec</button>: {count}
  </>
})

element('x-app', () => {
  return <>
    <h1>Testbed</h1>
    <Counter />
    <TestElement cols={10} rows={100} />
  </>
})
