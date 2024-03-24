from datetime import date

from dateutil.relativedelta import relativedelta

from odoo import fields, models, api, exceptions


class EstateModel(models.Model):
    _name = "estate"
    _description = "estate models"
    _order = "id desc"

    _sql_constraints = [
        ('check_expected_price', 'CHECK(expected_price >= 0)', 'The expected price cannot be negative.'),
        ('check_selling_price', 'CHECK(selling_price >= 0)', 'The selling price cannot be negative.'),
    ]

    name = fields.Char(required=True)
    description = fields.Text()
    postcode = fields.Char()
    date_availability = fields.Date(default=lambda self: date.today() + relativedelta(months=3), copy=False)
    expected_price = fields.Float(required=True)
    selling_price = fields.Float(readonly=True, copy=False)
    bedrooms = fields.Integer(default=2)
    living_area = fields.Integer()
    facades = fields.Integer()
    garage = fields.Boolean()
    garden = fields.Boolean()
    garden_area = fields.Integer()
    garden_orientation = fields.Selection(
        selection=[("north", "North"), ("south", "South"), ("east", "East"), ("west", "West")]
    )
    active = fields.Boolean(default=True)
    status = fields.Selection(
        default="new",
        selection=[("new", "New"), ("offer received", "Offer Received"), ("sold", "Sold"), ("canceled", "Canceled")]
    )
    partner_id = fields.Many2one("res.partner", string="Buyer")
    user_id = fields.Many2one('res.users', string='Salesman', index=True, tracking=True,
                              default=lambda self: self.env.user)
    type = fields.Many2one('estate.type', string='Property Type')
    tag_ids = fields.Many2many('estate.tag', string='Tags')
    offer_ids = fields.One2many('estate.offer', 'estate_id', string='Offers')

    total_area = fields.Float(compute="_compute_total_area")
    best_price = fields.Float(compute="_compute_best_price")

    has_offer = fields.Boolean(compute="_compute_has_offer")
    has_accepted_offer = fields.Boolean(compute="_compute_has_accepted_offer")

    @api.depends("living_area", "garden_area")
    def _compute_total_area(self):
        for record in self:
            print("record.living_area", record.living_area)
            record.total_area = record.living_area + record.garden_area

    @api.depends("offer_ids.price")
    def _compute_best_price(self):
        for record in self:
            record.best_price = max(record.offer_ids.mapped('price'), default=0)

    @api.onchange("garden")
    def _onchange_partner_id(self):
        if self.garden:
            self.garden_area = 10
            self.garden_orientation = "north"
        else:
            self.garden_area = 0
            self.garden_orientation = False

    def sold_action(self):
        for record in self:
            if record.status == 'canceled':
                raise exceptions.UserError("The status cannot be 'cancelled'.")

            record.status = 'sold'
        return True

    def cancel_action(self):
        for record in self:
            record.status = 'canceled'
        return True

    @api.constrains('selling_price')
    def _check_selling_price(self):
        for record in self:
            if record.selling_price < record.expected_price * 0.9:
                raise exceptions.ValidationError("기대 금액의 90% 미만은 선택 할 수 없습니다.")

    @api.depends('offer_ids')
    def _compute_has_offer(self):
        for record in self:
            record.has_offer = bool(record.offer_ids)
