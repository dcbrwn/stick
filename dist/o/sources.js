import { on } from '../dom';
import { createTag, noop } from '../util';
import { tagObservable } from './observable';
const fromEvent = (target, eventType, options = {}) => {
    return tagObservable((notify) => {
        const listener = notify;
        return on(target, eventType, listener, options);
    });
};
const fromArray = (source) => tagObservable((notify) => {
    for (let i = 0, len = source.length; i < len; i += 1)
        notify(source[i]);
    return noop;
});
const fromIterator = (source) => tagObservable((notify) => {
    let item;
    while (!(item = source.next()).done) {
        notify(item.value);
    }
    return () => {
        if (source.throw)
            source.throw(new Error('Iterator cancelled'));
    };
});
const from = (source, ...tail) => {
    if (tail.length > 0) {
        return fromArray([source, ...tail]);
    }
    else if (Array.isArray(source)) {
        return fromArray(source);
    }
    else if (typeof source === 'function') {
        return tagObservable(source);
    }
    else if (typeof source.next === 'function') {
        return fromIterator(source);
    }
    else {
        return fromArray([source]);
    }
};
const [tagBroadcast, isBroadcast] = createTag();
const broadcast = (input) => {
    const observers = new Set();
    let forget;
    const notifyAll = (value) => {
        // Manually iterating over the observers collection on V8 9.4
        // is roughly two times faster than using forEach with lambda
        const iterator = observers.values();
        let notify;
        while (!(notify = iterator.next()).done)
            notify.value(value);
    };
    return tagBroadcast(tagObservable((notify) => {
        observers.add(notify);
        if (observers.size === 1) {
            forget = input(notifyAll);
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
export { fromEvent, fromArray, fromIterator, from, isBroadcast, broadcast, merge };
//# sourceMappingURL=sources.js.map