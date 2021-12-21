import { stick } from 'stick'

stick((props: { header: string, content?: string }) => {
  return <div>
    <h1>{props.header}</h1>
    <p>{props.content} text</p>
  </div>
}, {
  tagName: 'x-app',
  reflect: {
    header: true
  }
})
