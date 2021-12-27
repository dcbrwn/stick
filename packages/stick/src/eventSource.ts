import { O } from './o'
import { observable } from './o/observable'
import { createTag } from './util'

export type EventSource<E extends Event, Mapped = unknown> = O<Mapped> & {
  dispatchEvent(event: E): boolean | undefined | void;
}

export const [tagEventSource, isEventSource] = createTag<EventSource<Event>>()

export function eventSource<E extends Event> (): EventSource<E, E>
export function eventSource<E extends Event, R> (map: (event: E) => R): EventSource<E, R>
export function eventSource<E extends Event, R> (map?: (event: E) => R): EventSource<E, R> {
  const [observe, next] = observable<R>()
  const eventSource = observe as EventSource<Event, R>
  eventSource.dispatchEvent = map
    ? (event: E) => next(map(event))
    // Without the `map` function, `next` by itself is equivalent to `dispatchEvent`
    : next as unknown as ((event: E) => void)
  return tagEventSource(eventSource)
}
