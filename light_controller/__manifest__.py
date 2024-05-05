# -*- coding: utf-8 -*-
{
    'name': "Lighting Control",

    'summary': """
        Lighting Control"
    """,

    'description': """
        Lighting Control Module for controlling lights in a room."
    """,

    'author': "Myou",
    'website': "https://www.odoo.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Controllers/Lighting',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'web'],
    'application': True,
    'installable': True,
    'data': [
        'views/templates.xml',
        'views/light.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'light_controller/static/src/**/*',
            'light_controller/static/lib/**/*',
            'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.min.js'
        ],
        'light_controller.assets_playground': [
            # bootstrap
            ('include', 'web._assets_helpers'),
            'web/static/src/scss/pre_variables.scss',
            'web/static/lib/bootstrap/scss/_variables.scss',
            ('include', 'web._assets_bootstrap_backend'),

            # required for fa icons
            'web/static/src/libs/fontawesome/css/font-awesome.css',

            # include base files from framework
            ('include', 'web._assets_core'),

            'web/static/src/core/utils/functions.js',
            'web/static/src/core/browser/browser.js',
            'web/static/src/core/registry.js',
            'web/static/src/core/assets.js',
            'light_controller/static/src/**/*',
        ],
    },
    'license': 'AGPL-3'
}


