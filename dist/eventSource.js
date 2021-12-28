import { observable } from './o/observable';
import { createTag } from './util';
export const [tagEventSource, isEventSource] = createTag();
export function eventSource(map) {
    const [observe, next] = observable();
    const eventSource = observe;
    eventSource.dispatchEvent = map
        ? (event) => next(map(event))
        // Without the `map` function, `next` by itself is equivalent to `dispatchEvent`
        : next;
    return tagEventSource(eventSource);
}
//# sourceMappingURL=eventSource.js.map