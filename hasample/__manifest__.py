{
    'name': 'My Module',
    'version': '1.0',
    'category': 'Tools',
    'summary': 'My Module for Odoo',
    'sequence': 10,
    'author': 'Your Name',
    'maintainer': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'depends': ['base', 'web'],
    'data': [
        'views/templates.xml',
        'views/menus.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'hasample/static/src/**/*',
        ],
        'hasample.assets_playground': [
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
            'hasample/static/src/**/*',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
}