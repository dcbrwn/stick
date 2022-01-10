import { observable, broadcast } from './o';
import { createTag } from './util';
const [tagInlet, isInlet] = createTag();
const inlet = () => {
    const [observer$, notifyObserved] = observable();
    const inlet = broadcast((notify) => {
        notifyObserved(notify);
        return () => notifyObserved(null);
    });
    inlet.observer$ = broadcast(observer$);
    return tagInlet(inlet);
};
const intoInlet = (inlet, input) => {
    let forget;
    inlet.observer$((notifyInlet) => {
        if (notifyInlet) {
            forget = input((value) => notifyInlet(value));
        }
        else if (forget) {
            forget();
        }
    });
    return () => {
        if (forget)
            forget();
    };
};
export { isInlet, inlet, intoInlet };
//# sourceMappingURL=inlet.js.map