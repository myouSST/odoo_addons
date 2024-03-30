# -*- coding: utf-8 -*-

import requests
from odoo import _, models, fields, api, exceptions
from .. import  event



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

    @api.onchange('switch')
    def _call_ha(self):
        status = self.switch and "on" or "off"

        url = "http://localhost:8080/api/glows/{id}/{status}".format(id=self.name, status=status)

        headers = {"Content-Type": "application/json"}
        data = {"key": "value"}

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            print('success')
            pass
        else:
            self.switch = not self.switch
            raise exceptions.UserError(_("Failed to toggle the switch. Please try again"))

    #@api.model
    #def _auto_init(self):
        #print('Glow auto init')
        #super(Glow, self)._auto_init()
        #event.glow_event.start_websocket_client(self.env)
