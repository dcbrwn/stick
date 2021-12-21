import { stick } from 'stick'
import { observable } from 'stick/o'

function createTimer () {
  let counter = 0

  return observable<number>((next) => {
    setInterval(() => {
      next(counter++)
    }, 1000)
  })
}

const TestElement = stick('x-test', (props: { header: string, content?: string }) => {
  const timer = createTimer()

  return <div>
    <h2>~~ {props.header} ~~</h2>
    <p>{props.content} </p>
    <p>Counter: {timer}</p>
  </div>
}, {
  reflect: {
    header: true
  }
})

stick('x-app', (props: { header: string, content?: string }) => {
  return <div>
    <h1>Test</h1>
    <TestElement header="It works" content='some contents' />
  </div>
})
