from odoo import fields, models


class EstateTagModel(models.Model):
    _name = 'estate.tag'
    _description = "estate tag models"

    name = fields.Char(required=True)