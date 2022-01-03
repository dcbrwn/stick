import { O } from './o'
import { observable } from './o/observable'
import { createTag } from './util'

type EventSource<E extends Event, Mapped = unknown> = O<Mapped> & {
  dispatchEvent(event: E): boolean | undefined | void;
}

const [tagEventSource, isEventSource] = createTag<EventSource<Event>>()

function eventSource<E extends Event> (): EventSource<E, E>
function eventSource<E extends Event, R> (map: (event: E) => R): EventSource<E, R>
// Typescript only allows to overload functions
// eslint-disable-next-line func-style
function eventSource<E extends Event, R> (map?: (event: E) => R): EventSource<E, R> {
  const [observe, next] = observable<R>()
  const eventSource = observe as EventSource<Event, R>
  eventSource.dispatchEvent = map
    ? (event: E) => next(map(event))
    // Without the `map` function, `next` by itself is equivalent to `dispatchEvent`
    : next as unknown as ((event: E) => void)
  return tagEventSource(eventSource)
}

export {
  type EventSource,
  tagEventSource,
  eventSource,
  isEventSource
}
