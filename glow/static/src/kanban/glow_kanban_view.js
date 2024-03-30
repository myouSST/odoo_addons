/** @odoo-module **/

import { registry } from "@web/core/registry";
import { kanbanView } from "@web/views/kanban/kanban_view";
import { GlowKanbanRenderer } from "./glow_kanban_renderer";

export const glowKanbanView = {
    ...kanbanView,
    Renderer: GlowKanbanRenderer,
};

registry.category("views").add("glow_kanban", glowKanbanView);