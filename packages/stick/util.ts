import { Displayed } from './definitions'

type Tag<Constraint extends object> = [
  tag: <T extends Constraint> (obj: T) => T,
  isTagged: (obj: unknown) => obj is Constraint
]

export function createTag<Constraint extends object = object> (description?: string): Tag<Constraint> {
  const tags = new WeakSet<Constraint>()

  return [
    function tag<T extends Constraint> (obj: T): T {
      tags.add(obj)
      return obj
    },
    function isTagged (obj: unknown): obj is Constraint {
      return tags.has(obj as Constraint)
    }
  ]
}

type Tuple<Constraint extends unknown[]> = [
  create: <T extends Constraint> (...items: T) => T,
  isInstance: (obj: unknown) => obj is Constraint
]

export function tuple<Constraint extends unknown[]> (description?: string): Tuple<Constraint> {
  const [tag, isTagged] = createTag<Constraint>(description)

  return [
    function create <T extends Constraint> (...items: T): T {
      tag(items)
      return items
    },
    isTagged
  ]
}

export function toString (value: Displayed): string {
  return typeof value === 'string' ? value : value.toString()
}

const re = /([a-z0-9])([A-Z])/g
export function camelToKebab (value: string): string {
  return value[0].toLowerCase() + value.slice(1).replace(re, (match, tail, head) => `${tail}-${head.toLowerCase()}`)
}
