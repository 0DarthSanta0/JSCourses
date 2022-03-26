module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["airbnb", "airbnb/hooks"],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "no-underscore-dangle": ["error", { "allowAfterThis": true }],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "max-len": "off",
        "no-restricted-syntax": "off",
        "max-classes-per-file": "off",
    }
}
