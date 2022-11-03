export const component = (tag, props, func) => {

    const element = class HTMLSmolElement extends HTMLElement {

        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: 'closed' });

            this.context = new func();
            this.context._attributes = this.getElementAttributes();
            this.context._element = this;
            this.context._innerHTML = this.shadow;

            this.render();

            this.runIfExists('_onReady')
        }

        static get observedAttributes() {
            return props;
        }

        attributeChangedCallback(name, old, value) {
            this.context._attributes[name] = value;
            this.render();
        }

        getElementAttributes() {
            let propList = {};
            props.forEach(prop => {
                propList[prop] = this.getAttribute(prop);
            });
            return propList;
        }

        render() {
            this.shadow.innerHTML = this.runIfExists('_render');

            const styles = this.runIfExists('_styles');
            if (styles) {
                const style = document.createElement('style');
                style.innerHTML = styles;
                this.shadow.appendChild(style);
            }

            this.bindEvents();
        }

        runIfExists(key, ...args) {
            if (typeof this.context[key] === 'function') {
                return this.context[key](...args);
            }
            return null;
        }

        bindEvents() {
            const events = [];

            [...this.shadow.querySelectorAll('*')]
                .filter((element) => [...element.attributes].forEach((attribute) => {
                    if (attribute.name.startsWith('on:')) {
                        events.push([element, attribute])
                    }
                }));

            events.forEach((event) => {
                event[0].addEventListener(event[1].name.split(':')[1], () => {
                    const evaluation = function () {
                        return eval(event[1].value)
                    }
                    evaluation.call(this.context);
                    this.render();
                })
            });

        }

        disconnectedCallback() {
            this.runIfExists('_onRemove');
        }
    }

    customElements.define(tag, element);
    return tag;
}

const hash = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash;
    }
    return new Uint32Array([hash])[0].toString(36);
};

console.log(hash('test'))