import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that exported functions are defined using z.function().implement() or .implementAsync() for Zod validation.",
    },
    fixable: undefined,
    schema: [],
    messages: {
      missingZodWrapper:
        "Exported function '{{name}}' must be wrapped with z.function().implement() or .implementAsync().",
      invalidZodWrapper:
        "Invalid Zod wrapper for function '{{name}}'; must be z.function(...).implement(fn) or .implementAsync(async fn).",
      notZodFunction: "The function call must originate from 'zod'.",
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
    // Helper to check if the chain starts with z.function()
    function isZodFunctionChain(node: any): boolean {
      let current = node;
      while (current.type === "CallExpression") {
        const callee = current.callee;
        if (callee.type !== "MemberExpression") return false;
        if (callee.property.type !== "Identifier") return false;
        if (callee.property.name === "function" && isFromZod(callee.object)) {
          return true;
        }
        current = callee.object;
      }
      return false;
    }
    // Helper to check if the init is a valid z.function().implement(fn) or .implementAsync(async fn)
    function isValidZodFunctionImplement(init: any): boolean {
      if (init.type !== "CallExpression") return false;
      const callee = init.callee;
      if (callee.type !== "MemberExpression") return false;
      if (
        callee.property.type !== "Identifier" ||
        (callee.property.name !== "implement" &&
          callee.property.name !== "implementAsync")
      ) {
        return false;
      }
      // Check the chain for z.function()
      if (!isZodFunctionChain(callee.object)) return false;
      // Check argument is a function expression
      if (init.arguments.length !== 1) return false;
      const fnArg = init.arguments[0];
      if (
        fnArg.type !== "ArrowFunctionExpression" &&
        fnArg.type !== "FunctionExpression"
      ) {
        return false;
      }
      // For implementAsync, ensure the fn is async
      if (callee.property.name === "implementAsync" && !fnArg.async) {
        return false;
      }
      return true;
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
      ExportNamedDeclaration: (node: any) => {
        if (
          node.declaration &&
          node.declaration.type === "VariableDeclaration"
        ) {
          const decl = node.declaration.declarations[0];
          if (decl && decl.id.type === "Identifier" && decl.init) {
            const funcName = decl.id.name;
            if (!isValidZodFunctionImplement(decl.init)) {
              context.report({
                node: decl,
                messageId: "missingZodWrapper",
                data: { name: funcName },
              });
            }
          }
        } else if (
          node.declaration &&
          node.declaration.type === "FunctionDeclaration"
        ) {
          const funcName = node.declaration.id
            ? node.declaration.id.name
            : "anonymous";
          context.report({
            node: node.declaration,
            messageId: "missingZodWrapper",
            data: { name: funcName },
          });
        }
      },
    };
  },
};

export default rule;
