from odoo import fields, models


class EstateTypeModel(models.Model):
    _name = "estate.type"
    _description = "estate type models"

    name = fields.Char(required=True)
    description = fields.Text()