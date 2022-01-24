import { css } from '@emotion/css'
import * as stick from '@stickts/stick'
import { element, Inlet, intoInlet } from '@stickts/stick'
import { match } from '@stickts/stick/directives'
import { O, map, pipe, rememberLast, observable } from '@stickts/stick/o'

export type Table<ItemMeta = {}> = {
  title: string,
  children?: Table<ItemMeta>[]
} & ItemMeta

const tocItem = css`
  & ul {
    margin: 0 4px;
  }
`

const tocTitle = css`
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
  const [selected$, setSelected] = observable<Table<T>>()

  if (props.selected$) {
    intoInlet(props.selected$, selected$)
  }

  const renderChild = (node: Table<T>) => {
    const titleStyle$ = pipe(
      selected$,
      rememberLast(),
      map((selected) => {
        return selected === node
          ? `${tocTitle} selected`
          : tocTitle
      })
    )

    const handleClick = (event: MouseEvent) => {
      event.stopPropagation()
      setSelected(node)
    }

    if (node.children) {
      return <div class={tocItem} title={node.title} onClick={handleClick}>
        <div class={titleStyle$}>{node.title}</div>
        <ul>{node.children.map(renderChild)}</ul>
      </div>
    } else {
      return <div class={titleStyle$} title={node.title} onClick={handleClick}>{node.title}</div>
    }
  }

  return match(props.table$, renderChild)
})
