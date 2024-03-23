from odoo import fields, models, api
from dateutil.relativedelta import relativedelta

class EstateOfferModel(models.Model):
    _name = 'estate.offer'
    _description = "estate offer models"

    price = fields.Float(required=True)
    status = fields.Selection(
        selection=[("accepted", "Accepted"), ("refused", "Refused")],
        default="accepted",
        copy=False
    )
    partner_id = fields.Many2one("res.partner", required=True)
    estate_id = fields.Many2one("estate", required=True)

    create_date = fields.Datetime(default=fields.Datetime.now, readonly=True)
    validity = fields.Integer(default=7)
    date_deadline = fields.Datetime(compute="_compute_date_deadline")

    @api.depends("create_date", "validity")
    def _compute_date_deadline(self):
        for record in self:
            record.date_deadline = record.create_date + relativedelta(days=record.validity)