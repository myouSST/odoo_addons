/** @odoo-module **/

import { Component, useEffect, useState, useSubEnv } from "@odoo/owl";
import { Paper } from "../paper/paper";
import { Switch } from "../switch/switch";
import { getDefaultConfig } from "@web/views/view";
import { PanelDialog } from "./panel_dialog";


export class Panel extends Component {
    static template = "light_controller.Panel";
    static components = {Paper, Switch, };
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

        useSubEnv({
            config: {
                ...getDefaultConfig(),
                ...this.env.config,
            }
        });
    }

    toggleAllSwitches() {
        for (let i = 0; i < this.switches.length; i++) {
            this.switches[i].checked = this.state.allOff; // Turn off all switches
        }
    }

    toggleSwitch(index) {
        this.switches[index].checked = !this.switches[index].checked;
    }

    handleEdit() {
        const dialog = this.env.services.dialog

        dialog.add(PanelDialog, {
            confirmText: "예",
            prompt:  "조명의 자동 제어 스케줄을 설정합니다.",
            size: "md",
            title: this.props.title,
            onConfirm: () => {
                console.log('qwdqd')
            },
            }
        );

    }
}

