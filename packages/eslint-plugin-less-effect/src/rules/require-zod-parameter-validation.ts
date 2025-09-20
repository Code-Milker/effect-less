// eslint/rules/require-zod-parameter-validation.ts

import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that function parameters are validated with Zod schema.parse in the parameter list.",
    },
    fixable: undefined, // No auto-fix for now
    schema: [], // No options for simplicity
    messages: {
      wrongParamCount:
        "This rule expects functions to have exactly one parameter for Zod validation enforcement.",
      missingZodValidation:
        "Function parameter must have a default value calling `schema.parse(arguments[0])` for Zod validation.",
      invalidZodParse:
        "Default value must be a call to `schema.parse(arguments[0])` where `schema` is an identifier.",
    },
  },
  create(context: Rule.RuleContext) {
    return {
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression": (
        node: any,
      ) => {
        // Check if function has parameters
        if (node.params.length === 0) {
          return; // Ignore functions with no parameters
        }

        // Expecting a single parameter for simplicity (can extend for multiple)
        if (node.params.length !== 1) {
          context.report({
            node,
            messageId: "wrongParamCount",
          });
          return;
        }

        const param = node.params[0];

        // Check if parameter has a default value
        if (param.type !== "AssignmentPattern") {
          context.report({
            node: param,
            messageId: "missingZodValidation",
          });
          return;
        }

        const defaultValue = param.right;

        // Check if default value is a call expression (e.g., schema.parse)
        if (defaultValue.type !== "CallExpression") {
          context.report({
            node: defaultValue,
            messageId: "invalidZodParse",
          });
          return;
        }

        // Check if the call is to a `parse` method on a schema
        if (
          defaultValue.callee.type !== "MemberExpression" ||
          defaultValue.callee.property.type !== "Identifier" ||
          defaultValue.callee.property.name !== "parse" ||
          defaultValue.callee.object.type !== "Identifier"
        ) {
          context.report({
            node: defaultValue,
            messageId: "invalidZodParse",
          });
          return;
        }

        // Check if the argument to parse is arguments[0]
        if (
          defaultValue.arguments.length !== 1 ||
          defaultValue.arguments[0].type !== "MemberExpression" ||
          defaultValue.arguments[0].object.type !== "Identifier" ||
          defaultValue.arguments[0].object.name !== "arguments" ||
          defaultValue.arguments[0].property.type !== "Literal" ||
          defaultValue.arguments[0].property.value !== 0
        ) {
          context.report({
            node: defaultValue,
            messageId: "invalidZodParse",
          });
          return;
        }
      },
    };
  },
};

export default rule;
