import { on } from '../dom';
import { createTag } from '../util';
import { tagObservable } from './observable';
const fromArray = (items) => {
    return tagObservable((notify) => {
        for (let i = 0, len = items.length; i < len; i += 1)
            notify(items[i]);
        return () => { };
    });
};
const fromEvent = (target, eventType, options = {}) => {
    return tagObservable((notify) => {
        const listener = notify;
        return on(target, eventType, listener, options);
    });
};
const [tagBroadcast, isBroadcast] = createTag();
const broadcast = (input) => {
    const observers = new Set();
    let forget;
    let lastValue;
    const notifyAll = (value) => {
        lastValue = value;
        // Manually iterating over the observers collection on V8 9.4
        // is roughly two times faster than using forEach with lambda
        const iterator = observers.values();
        let notify;
        while (!(notify = iterator.next()).done)
            notify.value(value);
    };
    return tagBroadcast(tagObservable((notify) => {
        if (observers.size === 0) {
            forget = input(notifyAll);
        }
        observers.add(notify);
        // TODO: `lastValue` may be intentionally undefined
        if (lastValue) {
            notify(lastValue);
        }
        return () => {
            observers.delete(notify);
            if (observers.size === 0)
                forget();
        };
    }));
};
const merge = (...inputs) => {
    return tagObservable((notify) => {
        const forgetFns = inputs.map((observe) => observe(notify));
        return () => forgetFns.forEach(forget => forget());
    });
};
export { fromArray, fromEvent, isBroadcast, broadcast, merge };
//# sourceMappingURL=sources.js.map