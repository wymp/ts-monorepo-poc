module.exports = [
    // For all code
    {
        "extends": [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
        ],
        "parser": "@typescript-eslint/parser",
    },

    // For all back-end code
    {
        "files": ["apps/*/{src,tests}/**/*","libs/*/{src,tests}/**/*"],
        "ignores": ["apps/my-react-app/**/*", "libs/shared-fe/**"],
        "env": {
            "browser": false,
            "node": true,
            "es2022": true
        },
        "parserOptions": {
            "ecmaVersion": "latest",
            "sourceType": "module"
        },
        "plugins": [
            "@typescript-eslint"
        ],
    },

    // For all front-end code
    {
        "files": ["apps/my-react-app/{src,tests}/**", "libs/shared-fe/{src,tests}/**"],
        "extends": [ 'plugin:react-hooks/recommended' ],
        "env": { "browser": true, "es2020": true },
        "plugins": ["react-refresh"],
        "rules": {
            "react-refresh/only-export-components": [
                "warn",
                { "allowConstantExport": true },
            ],
        },
    },

    // All code will be prettified, so make sure this is at the end
    {
        "extends": [
            "prettier",
        ],
    },
]
