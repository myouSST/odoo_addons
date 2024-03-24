/** @odoo-module **/

import {Component, useState} from "@odoo/owl";
import { Counter } from "./counter/counter";
import { Card } from "./card/card";
import {ThreeDComponent} from "./threejs/threejs";
import { registry } from "@web/core/registry";

export class Playground extends Component {
    static template = "awesome_owl.playground";
    static components = { Counter, Card, ThreeDComponent};

    setup() {
        this.sum = useState({ value: 0 });
    }

    increment() {
        this.sum.value++;
    }
}

registry.category("actions").add("awesome_owl.playground", Playground);
