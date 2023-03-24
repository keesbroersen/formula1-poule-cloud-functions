module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "require-jsdoc": 0,
    quotes: [0, "double"],
    "no-inferrable-types": "off",
    indent: [0, 4],
    "object-curly-spacing": [0, "always"],
    "import/no-unresolved": 0,
    "max-len": ["error", { code: 120 }],
    avoidEscape: 0,
    allowTemplateLiterals: 0,
    "quote-props": 0,
  },
};
