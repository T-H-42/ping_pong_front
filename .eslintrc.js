// module.exports = {
//     parser: '@typescript-eslint/parser',
//     plugins: ['prettier'],
//     extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
//     rules: {
//         indent: 'off', // Turn off the indentation rule to avoid conflicts with Prettier
//         'prettier/prettier': [
//             'error',
//             {
//                 singleQuote: true,
//                 semi: false,
//                 useTabs: false,
//                 tabWidth: 4,
//                 printWidth: 120,
//                 arrowParens: 'always',
//             },
//         ],
//         'import/extensions': [
//             'error',
//             'ignorePackages',
//             {
//                 js: 'never',
//                 jsx: 'never',
//                 ts: 'never',
//                 tsx: 'never',
//                 json: 'never',
//             },
//         ],
//         'import/order': 'off',
//         'import/extensions': 'off',
//         'import/no-unresolved': 'off',
//         'import/no-duplicates': 'off',
//     },
//     settings: {
//         'import/resolver': {
//             node: {
//                 extensions: ['.js', '.ts'],
//             },
//         },
//     },
// }
module.exports = {
    // parser: '@typescript-eslint/parser',
    plugins: ['prettier'],
    extends: ['airbnb-base'],

    rules: {
        indent: 'off', // Turn off the indentation rule to avoid conflicts with Prettier
        'object-curly-newline': 'off',
        'prettier/prettier': [
            'warn', // Change to 'warn' to make Prettier errors show as warnings, not errors
            {
                singleQuote: true,
                semi: true,
                useTabs: false,
                tabWidth: 4,
                printWidth: 120,
                arrowParens: 'always',
            },
        ],
        // Make import/extensions and import/no-unresolved show as warnings instead of errors
        'import/extensions': [
            'warn', // Change to 'warn' to make extension errors show as warnings
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
                json: 'never',
            },
        ],
        'import/no-unresolved': 'warn', // Change to 'warn' to make unresolved import errors show as warnings
        'import/order': 'off', // Turn off the import/order rule completely
        'import/no-duplicates': 'off', // Turn off the import/no-duplicates rule completely
        'import/prefer-default-export': 'off', // Disable import/prefer-default-export rule
        '@typescript-eslint/no-empty-interface': 'off', // Disable @typescript-eslint/no-empty-interface rule
        'consistent-return': 'off', // Disable consistent-return rule
        'no-shadow': 'off', // Disable no-shadow rule
        'arrow-body-style': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'warn',
        'no-multiple-empty-lines': 'off',
        camelcase: 'off',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
};
