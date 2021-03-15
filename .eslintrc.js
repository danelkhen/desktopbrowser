module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [/* TODO?"eslint:recommended",  "plugin:@typescript-eslint/recommended", */ "prettier"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    rules: {
        "@typescript-eslint/camelcase": "off",
        "prettier/prettier": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
    },
}
