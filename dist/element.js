import { stickKey } from './definitions';
import { appendChild } from './dom';
export function element(tagName, template, options = {}) {
    var _a, _b;
    const meta = {
        tagName,
        reflect: options.reflect || {}
    };
    customElements.define(tagName, (_b = class extends HTMLElement {
            constructor() {
                super(...arguments);
                this[_a] = meta;
                this.mount = false;
            }
            connectedCallback() {
                if (!this.mount) {
                    const [content, mount] = template(this.props);
                    this.mount = mount || true;
                    if (content)
                        appendChild(this, content);
                }
                if (typeof this.mount === 'function')
                    this.unmount = this.mount();
            }
            disconnectedCallback() {
                if (this.unmount) {
                    this.unmount();
                    this.unmount = undefined;
                }
            }
        },
        _a = stickKey,
        _b));
    return Object.assign(template, { [stickKey]: meta });
}
//# sourceMappingURL=element.js.map