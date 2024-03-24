/** @odoo-module */

import {Component, useState} from "@odoo/owl";

export class Counter extends Component {
    static template = "awesome_owl.Counter";
    static props = {
        onChange: { type: Function, optional: true }
    };

    setup() {
        this.state = useState({value: 0});
        this.data = useState({userId: 0, id: 0, title: "Test", body: ""});
    }

    increment() {
        this.state.value++;
        this.props.onChange && this.props.onChange();
    }

    async callApi() {
        const data = await callApi();
        this.data.userId = data.userId;
        this.data.title = data.title;
    }
}