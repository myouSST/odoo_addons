/** @odoo-module **/

import { Component, useEffect, useState } from "@odoo/owl";
import { Paper } from "../paper/paper";
import { Switch } from "../switch/switch";

export class Panel extends Component {
    static template = "light_controller.Panel";
    static components = {Paper, Switch};
    static props = {
        title: String,
        width: String,
        height: String,
        switches: {type: Array, default: () => []},
    };

    setup() {
        const switches2 = this.props.switches || [];
        this.switches = useState(switches2.map((s) => ({...s, checked: s.defaultChecked})));
        this.state = useState({
            allOff: false,
        });

        useEffect(() => {
            this.state.allOff = this.switches.every(s => !s.checked);
        }, () => this.switches.map(s => s.checked));

    }

    toggleAllSwitches() {
        for (let i = 0; i < this.switches.length; i++) {
            this.switches[i].checked = this.state.allOff; // Turn off all switches
        }
    }

    toggleSwitch(index) {
        this.switches[index].checked = !this.switches[index].checked;
    }
}

