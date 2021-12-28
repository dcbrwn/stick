import { createTag } from '../util';
export const [tagObservable, isObservable] = createTag();
export function observable() {
    let observer;
    return [
        tagObservable((newObserver) => {
            if (observer)
                throw new Error('No dice!');
            observer = newObserver;
            return () => {
                if (!observer) {
                    throw new Error('You fool!');
                }
                observer = undefined;
            };
        }),
        (value) => {
            if (observer)
                observer(value);
        }
    ];
}
//# sourceMappingURL=observable.js.map