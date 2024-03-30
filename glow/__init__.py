# -*- coding: utf-8 -*-

import odoo
from odoo.api import Environment
from . import models, event



def post_load():
    print('Glow post_load')
    with Environment.manage():
        with odoo.registry(odoo.tools.config['db_name']).cursor() as new_cr:
            event.glow_event.start_websocket_client(new_cr)
