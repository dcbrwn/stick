import { tagObservable } from './observable';
export function throttleToFrame(input) {
    const nextFrameTasks = [];
    function handleTasks() {
        for (let i = 0, len = nextFrameTasks.length; i < len; i += 1) {
            nextFrameTasks[i]();
        }
        nextFrameTasks.length = 0;
    }
    function addTask(task) {
        if (nextFrameTasks.length === 0) {
            requestAnimationFrame(handleTasks);
        }
        nextFrameTasks.push(task);
    }
    return tagObservable((notify) => {
        let nextValue;
        let isScheduled = false;
        function handleNextFrame() {
            isScheduled = false;
            notify(nextValue);
        }
        return input((value) => {
            nextValue = value;
            if (!isScheduled) {
                isScheduled = true;
                addTask(handleNextFrame);
            }
        });
    });
}
export const map = (fn) => (input) => {
    return tagObservable((notify) => {
        return input((value) => notify(fn(value)));
    });
};
export const scan = (fn, init) => (input) => {
    return tagObservable((notify) => {
        let memo = init;
        return input((value) => {
            notify(memo = fn(memo, value));
        });
    });
};
export const filter = (fn) => (input) => {
    return tagObservable((notify) => {
        return input((value) => {
            if (fn(value))
                notify(value);
        });
    });
};
//# sourceMappingURL=operators.js.map