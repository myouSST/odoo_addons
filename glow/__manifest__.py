{
    'name': 'Glow Switch',
    'version': '1.0',
    'category': 'Tools',
    'summary': 'Glow Controlled Switch',
    'sequence': 10,
    'author': 'myou',
    'maintainer': 'Your Company',
    'website': 'https://www.yourcompany.com',
    'depends': ['base', 'web'],
    'data': [
        'views/views.xml',
        'views/templates.xml',
        'views/menus.xml',
        'security/ir.model.access.csv',
    ],
    'assets': {
        'web.assets_backend': [
            'glow/static/src/**/*',
        ],
        'glow.assets_playground': [
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
            'glow/static/src/**/*',
        ],
    },
    'installable': True,
    'application': True,
    'images': ['static/description/icon.png'],
    'auto_install': False,
}