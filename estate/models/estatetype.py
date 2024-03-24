from odoo import fields, models


class EstateTypeModel(models.Model):
    _name = "estate.type"
    _description = "estate type models"
    _order = 'sequence asc'

    _sql_constraints = [
        ('name_unique', 'UNIQUE(name)', 'The name must be unique'),
    ]

    sequence = fields.Integer('Sequence', default=1, help="Used to order stages. Lower is better.")
    name = fields.Char(required=True)
    description = fields.Text()

    estate_ids = fields.One2many('estate', 'type', string='estates')
