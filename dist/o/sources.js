import { on } from '../dom';
import { tagObservable } from './observable';
export function fromArray(items) {
    return tagObservable((notify) => {
        // eslint-disable-next-line prefer-const
        for (let i = 0, len = items.length; i < len; i += 1)
            notify(items[i]);
        return () => { };
    });
}
export function fromEvent(target, eventType, options = {}) {
    return tagObservable((notify) => {
        const listener = notify;
        return on(target, eventType, listener, options);
    });
}
export function broadcast(input) {
    const observers = new Set();
    let forget;
    return tagObservable((notify) => {
        if (observers.size === 0) {
            forget = input((value) => observers.forEach((notify) => notify(value)));
        }
        observers.add(notify);
        return () => {
            observers.delete(notify);
            if (observers.size === 0)
                forget();
        };
    });
}
export function merge(...inputs) {
    return tagObservable((notify) => {
        const forgetFns = inputs.map((observe) => observe(notify));
        return () => forgetFns.forEach(forget => forget());
    });
}
//# sourceMappingURL=sources.js.map