import { element, inlet } from '@stickts/stick'
import { match, repeat } from '@stickts/stick/directives'
import { O, map, filter, pipe, Observer, tap } from '@stickts/stick/o'
import styles from './style.module.css'

export type Table<ItemMeta = unknown> = {
  title: string,
  children?: Table<ItemMeta>[]
  meta?: ItemMeta
}

export const TableOfContents = element<{
  table$: O<Table>,
  onSelected?: Observer<string>,
}>('x-toc', (props) => {
  const children$ = pipe(
    props.table$,
    filter((table) => Boolean(table.children)),
    map((table) => table.children!)
  )

  return match(props.table$, (table) => {
    const click$ = inlet<MouseEvent>()

    if (props.onSelected) {
      pipe(
        click$,
        map(() => table.title),
        tap(props.onSelected)
      )
    }

    return <div class={styles.tocItem} title={table.title} onClick={click$}>
      <div>{table.title}</div>
      <ul>{repeat(children$, (child) => <TableOfContents table$={child} />)}</ul>
    </div>
  })
})
