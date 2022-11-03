import { component } from "../src/smol.js";

component('my-button', ['count'], function () {
    this.internalCount = 0;

    this._onReady = () => {
        console.log('Ready', this);
    }

    this.test = () => {
        this.internalCount = this._attributes.count;
    }

    this._render = () => (`<button on:click="this.test()">Hello ${this.internalCount} // ${this._attributes.count}</button>`);
});

component('user-chip', ['name'], function () {
    this._styles = () => (`
        span {
            background: red;
            color: white;
        }
    `);

    this._render = () => (`<span>${this._attributes.name}</span>`);
});

component('big-card', ['combine'], function () {
    this._render = () => (`
        <my-button count="${this._attributes.combine}"></my-button>
        <user-chip name="${this._attributes.combine}"></user-chip>
    `);
});