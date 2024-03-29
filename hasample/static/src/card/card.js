/** @odoo-module */

import {Component, useState} from "@odoo/owl";

export class Card extends Component {

    static template = "hasample.Card";
    static props = {
        title: String,
        slots: {
            type: Object,
            shape: {
                default: true
            },
        }
    };

    setup() {
        this.state = useState({isOpen: false});
    }

    toggle() {
        this.state.isOpen = !this.state.isOpen;
    }
}