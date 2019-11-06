module.exports = {
    "extends": ["airbnb-base", 
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "env": {
        "mocha": true,
        "node": true
    },
    "rules": {
        "no-unused-vars": [
            1,
            {
                "argsIgnorePattern": "Promise|res|next|^err"
            },
        ],
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/ban-ts-ignore": 0,
        // some db names in snake case
        "@typescript-eslint/camelcase": 0,
        "camelcase": 0,
        "func-names": 0,
        "arrow-body-style": ['warn'],
        "no-param-reassign": 0,
        "prefer-promise-reject-errors": 0,
        "import/prefer-default-export": 0
    },
    "settings" : {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    }
};