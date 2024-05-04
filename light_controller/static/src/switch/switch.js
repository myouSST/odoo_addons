/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class Switch extends Component {
    static template = "light_controller.Switch";
    static props = {
        title: String,
        checked: String,
        onChange: { type: Function, optional: true }
    };

    setup() {
        this.state = useState({isChecked: this.props.checked});
    }

    toggle() {
        this.props.onChange && this.props.onChange();
        this.state.isChecked = !this.state.isChecked;
    }
}