# -*- coding: utf-8 -*-

import requests

from odoo import _, models, fields, api, exceptions
from odoo.http import request


class Glow(models.Model):
    _name = 'glow'
    _description = 'glow'

    name = fields.Char()
    switch = fields.Boolean(
        tracking=True
    )
    description = fields.Text()
    sequence = fields.Integer()
    group_id = fields.Many2one('glow.group', string='Group', readonly=False)
    status = fields.Selection([('on', 'On'), ('off', 'Off')], compute='_compute_status', store=True)

    @api.depends('switch')
    def _compute_status(self):
        for record in self:
            record.status = record.switch and 'on' or 'off'

    @api.onchange('switch')
    def _switch_change(self):
        try:
            self.call_ha()
        except exceptions.UserError as e:
            self.switch = not self.switch
            raise e

    def switch_off_all(self, group_id):
        records_in_group = self.search([('group_id', '=', group_id)])
        for record in records_in_group:
            if record.switch:
                try:
                    record.switch = False
                    record.call_ha()
                except exceptions.UserError as e:
                    record.switch = True
                    raise e

        request.env["bus.bus"]._sendone('update-glow-switch', "notification", {"test": "test"})

    def switch_on_all(self, group_id):
        records_in_group = self.search([('group_id', '=', group_id)])
        for record in records_in_group:
            if not record.switch:
                try:
                    record.switch = True
                    record.call_ha()
                except exceptions.UserError as e:
                    record.switch = False
                    raise e

    def call_ha(self):
        status = self.switch and "on" or "off"

        url = "http://localhost:8080/api/glows/{id}/{status}".format(id=self.name, status=status)

        headers = {"Content-Type": "application/json"}
        data = {"key": "value"}

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            print('success')
            pass
        else:
            raise exceptions.UserError(_("Failed to toggle the switch. Please try again"))

    # @api.model
    # def _auto_init(self):
    # print('Glow auto init')
    # super(Glow, self)._auto_init()
    # event.glow_event.start_websocket_client(self.env)
