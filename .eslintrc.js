module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["example"],
  rules: {
    "example/my-first-rule": "error",
    // "example/res-err-return-rule": "error",
    // No classes or OOP constructs
    // "functional/no-class": "error",
    // "functional/no-this-expression": "error",
    // Enforce readonly/immutable
    // "functional/immutable-data": "error",
    // "functional/prefer-immutable-types": "error",
    // "@typescript-eslint/prefer-readonly": "error",
    // "@typescript-eslint/prefer-readonly-parameter-types": "error",
    // No any
    // "@typescript-eslint/no-explicit-any": "error",
  },
};
