import { element, Inlet, inlet, intoInlet } from '@stickts/stick'
import { RenderResult } from '@stickts/stick/definitions'
import { match } from '@stickts/stick/directives'
import { O, fromEvent, map, throttleToFrame, merge, scan, from, pipe } from '@stickts/stick/o'
import { Table, TableOfContents } from '../TableOfContents'
import styles from './style.module.css'

const VectorView = element('x-vector', (props: { x: O<number>, y: O<number> }) => {
  return <span title={props.x}>({props.x}, {props.y})</span>
})

const TestElement = element('x-update-perf', (props: { cols: number, rows: number }) => {
  const mouseMove = throttleToFrame(fromEvent<MouseEvent>(document, 'mousemove'))

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

const perfTest = () => {
  return <TestElement cols={10} rows={100} />
}

const Counter = element('x-counter', (props: {
  init: number,
  count$: Inlet<number>
}) => {
  const inc$ = inlet<MouseEvent>()
  const dec$ = inlet<MouseEvent>()

  intoInlet(props.count$, pipe(
    merge(
      from(0),
      map(1)(inc$),
      map(-1)(dec$)
    ),
    scan((counter, change) => counter + change, props.init)
  ))

  return <>
    <button onClick={inc$}>inc</button> <button onClick={dec$}>dec</button>
  </>
})

const counterExample = () => {
  const count$ = inlet<number>()

  return <p>
    <Counter init={9000} count$={count$}/>
    <br />
    Current count is: {count$}
  </p>
}

element('x-app', () => {
  type ExampleTOC = Table<{ renderer?: () => RenderResult }>
  const chapter$ = inlet<ExampleTOC>()
  const toc$ = from<ExampleTOC>({
    title: 'Examples',
    children: [
      {
        title: 'Counter',
        renderer: counterExample
      },
      {
        title: 'Performance',
        renderer: perfTest
      },
      { title: 'Todo' }
    ]
  })

  return <div class={styles.appRoot}>
    <div class={styles.sidebar}>
      <h1>Testbed</h1>
      <TableOfContents table$={toc$} selected$={chapter$} />
    </div>
    <div class={styles.content}>
      {match(chapter$, (value) => {
        return value.renderer ? value.renderer() : <span>what?</span>
      })}
    </div>
  </div>
})
