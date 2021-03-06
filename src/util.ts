import { Displayed } from './definitions'

type Tag<Constraint extends object> = [
  tag: <T extends Constraint> (obj: T) => T,
  isTagged: (obj: unknown) => obj is Constraint
]

const createTag = <Constraint extends object = object> (description?: string): Tag<Constraint> => {
  // Using set to store tags, is not the most efficient solution,
  // but it works for immutable objects and non-invasive
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

const toString = (value: Displayed): string => {
  return typeof value === 'string' ? value : value.toString()
}

const re = /([a-z0-9])([A-Z])/g
const camelToKebab = (value: string): string => {
  return value[0].toLowerCase() + value.slice(1).replace(re, (match, tail, head) => `${tail}-${head.toLowerCase()}`)
}

const noop = (...args: unknown[]): void => {}

const identity = <T>(input: T): T => input

export {
  createTag,
  toString,
  camelToKebab,
  noop,
  identity
}
