/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { Card } from "./card/card";
import { registry } from "@web/core/registry";

export class Playground extends Component {
    static template = "hasample.playground";
    static components = {Card};

    setup() {
        this.sum = useState({value: 0});
    }

    increment() {
        this.sum.value++;
    }
}

registry.category("actions").add("hasample.playground", Playground);

