/** @odoo-module **/

import { KanbanRenderer } from "@web/views/kanban/kanban_renderer";
import { KanbanHeader } from "@web/views/kanban/kanban_header";
import { useService, useBus } from "@web/core/utils/hooks";

class GlowKanbanHeader extends KanbanHeader {
    static template = "glow.KanbanHeader";
    static components = {
        ...KanbanHeader.components,
    };

    setup() {
        super.setup();
        this.orm = useService("orm");

        //TODO BUS 서비스 처리
        useBus(this.env.bus, "update-glow-switch", (ev) => this._reloadView(ev.detail));
    }

    async switchOffAll() {
        const groupId = this.props.group.value;
        await this.orm.call("glow", "switch_off_all", [[]], {
            group_id: groupId,
        });
    }

    async switchOnAll() {
        const groupId = this.props.group.value;
        await this.orm.call("glow", "switch_on_all", [[]], {
            group_id: groupId,
        });
    }

    _reloadView(payload) {
        console.log("Reloading view");
        console.log(payload);
        this.reload();
    }
}

export class GlowKanbanRenderer extends KanbanRenderer {
}

GlowKanbanRenderer.components = {
    ...KanbanRenderer.components,
    KanbanHeader: GlowKanbanHeader,
};


