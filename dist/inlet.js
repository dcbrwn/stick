import { tagObservable, observable } from './o';
import { createTag } from './util';
const [tagInlet, isInlet] = createTag();
const inlet = () => {
    const [observer$, notifyObserved] = observable();
    const inlet = (notify) => {
        notifyObserved(notify);
        return () => notifyObserved(null);
    };
    inlet.observer$ = observer$;
    return tagObservable(tagInlet(inlet));
};
const intoInlet = (input, inlet) => {
    let forget;
    inlet.observer$((notifyInlet) => {
        if (notifyInlet) {
            forget = input((value) => notifyInlet(value));
        }
        else if (forget) {
            forget();
        }
    });
};
export { isInlet, inlet, intoInlet };
//# sourceMappingURL=inlet.js.map