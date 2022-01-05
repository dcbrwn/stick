import { createTag } from '../util';
const [tagObservable, isObservable] = createTag();
const observable = () => {
    let observer;
    return [
        tagObservable((newObserver) => {
            if (observer)
                throw new Error('Already observed');
            observer = newObserver;
            return () => {
                if (!observer)
                    throw new Error('Already forgotten');
                observer = undefined;
            };
        }),
        (value) => {
            if (observer)
                observer(value);
        }
    ];
};
export { observable, tagObservable, isObservable };
//# sourceMappingURL=observable.js.map