module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["less-effect"],
  // plugins: ["less-effect", "functional"],
  rules: {
    // custom rules
    "less-effect/res-err-return-rule": "error",
    "less-effect/res-err-async-return-rule": "error",
    "less-effect/require-zod-parameter-validation-rule": "error",
    // imported rules
    // "functional/no-class": "error",
    // "functional/no-this-expression": "error",
    // "functional/immutable-data": "error",
    // "@typescript-eslint/prefer-readonly": "error",
    // "@typescript-eslint/no-explicit-any": "error",
  },
};
