/** @odoo-module **/

import { Component } from "@odoo/owl";

export class Paper extends Component {
    static template = "light_controller.Paper";
    static props = {
        title: String,
        width: String,
        height: String,
        onClick: {type: Function, optional: true},
        clickable: Boolean,
    };

    handleClick(e) {
        this.props.onClick && this.props.onClick();
    }
}