/** @odoo-module **/

import { Component, hooks, onWillStart } from "@odoo/owl";
import { loadJS, loadCss } from '@web/core/assets';

export class ThreeDComponent extends Component {
    static template = "awesome_owl.ThreeDComponent";

    setup() {
        onWillStart(async () => {
            await loadJS("/awesome_owl/static/lib/three.min.js");
        });
    }

}