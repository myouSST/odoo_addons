# -*- coding: utf-8 -*-

from odoo import models, fields


class GlowGroup(models.Model):
    _name = 'glow.group'
    _description = 'glow.group'

    name = fields.Char()
    description = fields.Text()


