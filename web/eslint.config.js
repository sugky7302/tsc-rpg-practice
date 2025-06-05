module.exports = [
    {
        ignores: [
            'projects/**/*',
            'lib/**/*',
            'dist',
            '**/assets/**/*',
            'jest.config.js',
            'fixtures',
            'coverage',
            '__snapshots__',
        ],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                project: ['tsconfig.json'],
                createDefaultProgram: true,
            },
        },
        plugins: {
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            '@angular-eslint': require('@angular-eslint/eslint-plugin'),
            '@angular-eslint/template': require('@angular-eslint/eslint-plugin-template'),
            prettier: require('eslint-plugin-prettier'),
        },
        rules: {
            ...require('@angular-eslint/eslint-plugin').configs.recommended.rules,
            ...require('@typescript-eslint/eslint-plugin').configs.recommended.rules,
            ...require('@angular-eslint/eslint-plugin-template').configs['process-inline-templates']
                .rules,
            ...require('eslint-config-prettier').rules,
            '@typescript-eslint/no-explicit-any': 'off',
            '@angular-eslint/no-empty-lifecycle-method': 'off',
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        plugins: {
            '@angular-eslint/template': require('@angular-eslint/eslint-plugin-template'),
            prettier: require('eslint-plugin-prettier'),
        },
        rules: {
            ...require('@angular-eslint/eslint-plugin-template').configs.recommended.rules,
            ...require('@angular-eslint/eslint-plugin-template').configs.accessibility.rules,
            ...require('eslint-config-prettier').rules,
        },
    },
];
