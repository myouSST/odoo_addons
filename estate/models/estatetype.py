from odoo import fields, models


class EstateTypeModel(models.Model):
    _name = "estate.type"
    _description = "estate type models"

    _sql_constraints = [
        ('name_unique', 'UNIQUE(name)', 'The name must be unique'),
    ]

    name = fields.Char(required=True)
    description = fields.Text()