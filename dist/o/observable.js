import { createTag } from '../util';
export const [tagObservable, isObservable] = createTag();
export const observable = () => {
    let observer;
    return [
        tagObservable((newObserver) => {
            if (observer)
                throw new Error('Observable is already owned');
            observer = newObserver;
            return () => {
                if (!observer) {
                    throw new Error('Observable is already forgotten');
                }
                observer = undefined;
            };
        }),
        (value) => {
            if (observer)
                observer(value);
        }
    ];
};
//# sourceMappingURL=observable.js.map