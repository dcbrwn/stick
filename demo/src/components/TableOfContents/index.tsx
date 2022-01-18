import { css } from '@emotion/css'
import * as stick from '@stickts/stick'
import { element, Inlet, inlet, intoInlet } from '@stickts/stick'
import { match } from '@stickts/stick/directives'
import { O, map, pipe, rememberLast } from '@stickts/stick/o'

export type Table<ItemMeta = {}> = {
  title: string,
  children?: Table<ItemMeta>[]
} & ItemMeta

const tocItem = css`
  & ul {
    margin: 0 4px;
  }
`

const tocTitle= css`
  display: block;
  cursor: pointer;
  border-radius: 4px;
  max-width: 200px;
  padding: 4px 8px;
  font-size: 14px;
  color: #000D;

  &.selected {
    color: #000F;
    background-color: #0001;
  }
`

export const TableOfContents = element('x-toc', function <T> (props: {
  table$: O<Table<T>>,
  selected$?: Inlet<Table<T>>,
}) {
  const selected$ = inlet<Table<T>>()

  if (props.selected$) {
    intoInlet(props.selected$, selected$)
  }

  const renderChild = (node: Table<T>) => {
    const click$ = inlet<MouseEvent>()

    intoInlet(selected$, pipe(
      click$,
      map((event) => {
        event.stopPropagation()
        return node
      })
    ))

    const titleStyle$ = pipe(
      selected$,
      rememberLast(),
      map((selected) => {
        return selected === node
          ? `${tocTitle} selected`
          : tocTitle
      })
    )

    if (node.children) {
      return <div class={tocItem} title={node.title} onClick={click$}>
        <div class={titleStyle$}>{node.title}</div>
        <ul>{node.children.map(renderChild)}</ul>
      </div>
    } else {
      return <div class={titleStyle$} title={node.title} onClick={click$}>{node.title}</div>
    }
  }

  return match(props.table$, renderChild)
})
