import { stick } from 'stick'
import { fromEvent, observable } from 'stick/o'

function createTimer () {
  let counter = 0

  return observable<number>((next) => {
    setInterval(() => {
      next(counter++)
    }, 1000)
  })
}

const TestElement = stick('x-update-perf', (props: { cols: number, rows: number }) => {
  // const timer = createTimer()
  const mouseMove = fromEvent<MouseEvent>(document, 'mousemove')

  const body = []
  for (let i = 0; i < props.rows; i += 1) {
    for (let j = 0; j < props.cols; j += 1) {
      const value = mouseMove.map((event) => {
        return `(${event.pageX * i}, ${event.pageY * j})`
      })
      // const value = timer.map((time) => time * i * j)
      const style = `
        position: absolute;
        contain: strict;
        top: ${i * 30}px;
        left: ${j * 100}px;
        width: 100px;
        height: 30px;
        overflow: hidden;
        white-space: nowrap;
      `
      body.push(<div style={style}>{value}</div>)
    }
  }

  return <div style="position: relative; font-family: monospace">{body}</div>
})

stick('x-app', (props: { header: string, content?: string }) => {
  return <div>
    <h1>Test</h1>
    <TestElement cols={10} rows={100} />
  </div>
})
