import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that function parameters are validated with Zod schema.parse in the parameter list.",
    },
    fixable: undefined,
    schema: [],
    messages: {
      missingZodValidation:
        "Parameter '{{name}}' must have a default value calling a Zod schema.parse(arguments[{{index}}]).",
      invalidZodParse:
        "Default value for parameter '{{name}}' must be a call to a Zod schema.parse(arguments[{{index}}]).",
      notZodSchema: "The schema before .parse must originate from 'zod'.",
    },
  },
  create(context: Rule.RuleContext) {
    const zodLocals = new Set<string>();

    // Helper to check if the base identifier is from 'zod'
    function isFromZod(node: any): boolean {
      if (node.type === "Identifier") {
        return zodLocals.has(node.name);
      }
      return false;
    }

    // Recursively check if the object before .parse is Zod-related
    function isZodSchemaExpression(node: any): boolean {
      if (node.type === "Identifier") {
        return isFromZod(node);
      } else if (
        node.type === "CallExpression" ||
        node.type === "MemberExpression"
      ) {
        return isZodSchemaExpression(
          node.callee ? node.callee.object : node.object,
        );
      }
      return false;
    }

    return {
      ImportDeclaration: (node: any) => {
        if (node.source.value === "zod") {
          node.specifiers.forEach((spec: any) => {
            if (
              spec.type === "ImportSpecifier" ||
              spec.type === "ImportDefaultSpecifier" ||
              spec.type === "ImportNamespaceSpecifier"
            ) {
              zodLocals.add(spec.local.name);
            }
          });
        }
      },
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression": (
        node: any,
      ) => {
        // Skip if this function is a Promise constructor callback
        if (
          node.parent &&
          node.parent.type === "NewExpression" &&
          node.parent.callee &&
          node.parent.callee.name === "Promise"
        ) {
          return;
        }

        if (node.params.length === 0) return;
        node.params.forEach((param: any, index: number) => {
          const isAssignment = param.type === "AssignmentPattern";
          const actualParam = isAssignment ? param.left : param;
          if (actualParam.type !== "Identifier") return; // Skip destructuring
          const paramName = actualParam.name;
          if (!isAssignment) {
            context.report({
              node: param,
              messageId: "missingZodValidation",
              data: { name: paramName, index: index.toString() },
            });
            return;
          }
          const defaultValue = param.right;
          if (defaultValue.type !== "CallExpression") {
            context.report({
              node: defaultValue,
              messageId: "invalidZodParse",
              data: { name: paramName, index: index.toString() },
            });
            return;
          }
          const callee = defaultValue.callee;
          if (
            callee.type !== "MemberExpression" ||
            callee.property.type !== "Identifier" ||
            callee.property.name !== "parse"
          ) {
            context.report({
              node: defaultValue,
              messageId: "invalidZodParse",
              data: { name: paramName, index: index.toString() },
            });
            return;
          }
          // Check if the schema expression is Zod-related
          if (!isZodSchemaExpression(callee.object)) {
            context.report({
              node: callee.object,
              messageId: "notZodSchema",
            });
            return;
          }
          // Check argument is arguments[index]
          if (
            defaultValue.arguments.length !== 1 ||
            defaultValue.arguments[0].type !== "MemberExpression" ||
            defaultValue.arguments[0].object.type !== "Identifier" ||
            defaultValue.arguments[0].object.name !== "arguments" ||
            defaultValue.arguments[0].property.type !== "Literal" ||
            defaultValue.arguments[0].property.value !== index
          ) {
            context.report({
              node: defaultValue,
              messageId: "invalidZodParse",
              data: { name: paramName, index: index.toString() },
            });
            return;
          }
        });
      },
    };
  },
};

export default rule;
