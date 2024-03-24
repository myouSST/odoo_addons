from odoo import fields, models


class EstateTagModel(models.Model):
    _name = 'estate.tag'
    _description = "estate tag models"
    _order = 'name asc'

    name = fields.Char(required=True)
    color = fields.Integer()