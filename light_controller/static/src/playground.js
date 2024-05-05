/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { Panel } from "./panel/panel";
import { Switch } from "./switch/switch";
import { registry } from "@web/core/registry";
import { Paper } from "./paper/paper";
import { ThreeDComponent } from "./threejs/threejs";

const switchData =
    [
        {title: 'LAKE-1', id: 1, defaultChecked: false, section: 'LAKE'},
        {title: 'LAKE-2', id: 2, defaultChecked: true, section: 'LAKE'},
        {title: 'LAKE-3', id: 3, defaultChecked: false, section: 'LAKE'},
        {title: 'LAKE-4', id: 4, defaultChecked: false, section: 'LAKE'},
        {title: 'LAKE-5', id: 5, defaultChecked: false, section: 'LAKE'},
        {title: 'LAKE-6', id: 6, defaultChecked: false, section: 'LAKE'},

        {title: 'HILL-1', id: 1, defaultChecked: true, section: 'HILL'},
        {title: 'HILL-2', id: 2, defaultChecked: true, section: 'HILL'},
        {title: 'HILL-3', id: 3, defaultChecked: false, section: 'HILL'},
        {title: 'HILL-4', id: 4, defaultChecked: false, section: 'HILL'},
        {title: 'HILL-5', id: 5, defaultChecked: false, section: 'HILL'},
        {title: 'HILL-6', id: 6, defaultChecked: false, section: 'HILL'},
        {title: 'HILL-7', id: 7, defaultChecked: false, section: 'HILL'},

        {title: 'Green-1', id: 1, defaultChecked: true, section: 'Green'},
        {title: 'Green-2', id: 2, defaultChecked: true, section: 'Green'},
        {title: 'Green-3', id: 3, defaultChecked: false, section: 'Green'},
        {title: 'Green-4', id: 4, defaultChecked: false, section: 'Green'},
        {title: 'Green-5', id: 5, defaultChecked: false, section: 'Green'},
        {title: 'Green-6', id: 6, defaultChecked: false, section: 'Green'},
        {title: 'Green-7', id: 7, defaultChecked: false, section: 'Green'},
    ];


export class Playground extends Component {
    static template = "light_controller.playground";
    static components = {Panel, Switch, Paper, ThreeDComponent};

    setup() {
        this.sum = useState({value: 0});
        this.groupedSwitchData = this.groupBySection(switchData);
    }

    groupBySection(switchData) {
        return switchData.reduce((grouped, switchItem) => {
            (grouped[switchItem.section] = grouped[switchItem.section] || []).push(switchItem);
            return grouped;
        }, {});
    }
}

registry.category("actions").add("light_controller.playground", Playground);
