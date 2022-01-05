import { tagObservable } from './observable';
const throttleToFrame = (input) => {
    const nextFrameTasks = [];
    const handleTasks = () => {
        for (let i = 0, len = nextFrameTasks.length; i < len; i += 1) {
            nextFrameTasks[i]();
        }
        nextFrameTasks.length = 0;
    };
    const addTask = (task) => {
        if (nextFrameTasks.length === 0) {
            requestAnimationFrame(handleTasks);
        }
        nextFrameTasks.push(task);
    };
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
                addTask(handleNextFrame);
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
export { throttleToFrame, map, tap, scan, filter };
//# sourceMappingURL=operators.js.map