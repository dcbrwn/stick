import { tagObservable } from './observable';
const throttle = (defer = requestAnimationFrame) => (input) => {
    return tagObservable((notify) => {
        let nextValue;
        let isScheduled = false;
        const handleNextFrame = () => {
            isScheduled = false;
            notify(nextValue);
        };
        return input((value) => {
            nextValue = value;
            if (!isScheduled) {
                isScheduled = true;
                defer(handleNextFrame);
            }
        });
    });
};
const map = (fnOrValue) => (input) => tagObservable((notify) => {
    return typeof fnOrValue === 'function'
        ? input((value) => notify(fnOrValue(value)))
        : input(() => notify(fnOrValue));
});
const tap = (fn) => (input) => tagObservable((notify) => {
    return input((value) => {
        fn(value);
        notify(value);
    });
});
const scan = (fn, init) => (input) => tagObservable((notify) => {
    let memo = init;
    return input((value) => notify(memo = fn(memo, value)));
});
const filter = (fn) => (input) => tagObservable((notify) => {
    return input((value) => {
        if (fn(value))
            notify(value);
    });
});
const rememberLast = (init = undefined) => {
    let last = init;
    return (input) => tagObservable((notify) => {
        notify(last);
        return input((value) => {
            last = value;
            notify(value);
        });
    });
};
export { throttle, map, tap, scan, filter, rememberLast };
//# sourceMappingURL=operators.js.map