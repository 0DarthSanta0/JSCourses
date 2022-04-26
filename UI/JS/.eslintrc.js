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
        "no-underscore-dangle": "off",
        "no-plusplus": "off",
        "max-len": "off",
        "no-restricted-syntax": "off",
        "max-classes-per-file": "off",
        "no-unused-vars": "off",
        "class-methods-use-this": "off",
    }
}
