/** @odoo-module **/

import { Component } from "@odoo/owl";

export class Paper extends Component {
    static template = "light_controller.Paper";
    static props = {
        title: String,
        width: String,
        height: String,
    };
}