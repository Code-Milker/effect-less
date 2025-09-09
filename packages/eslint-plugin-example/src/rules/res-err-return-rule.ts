import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description:
        "Enforces Go-style returns: [res, err] (or configurable) with error-like second element",
    },
    schema: [
      {
        type: "object",
        properties: {
          resName: { type: "string", default: "res" },
          errName: { type: "string", default: "err" },
          checkErrorLike: { type: "boolean", default: true },
          enforceAsyncPair: { type: "boolean", default: true },
          targetFunctionTypes: {
            type: "array",
            items: { type: "string" },
            default: ["FunctionDeclaration", "FunctionExpression"],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context: Rule.RuleContext) => {
    const {
      resName = "res",
      errName = "err",
      checkErrorLike = true,
      enforceAsyncPair = true,
      targetFunctionTypes = ["FunctionDeclaration", "FunctionExpression"],
    } = context.options[0] || {};

    const functionStack: boolean[] = [];
    let isAsync = false;
    let hasReturn = false;

    const isTargetFunction = (node: any) =>
      targetFunctionTypes.includes(node.type);

    const checkReturnArgument = (arg: any, node: any) => {
      if (arg?.type !== "ArrayExpression" || arg.elements.length !== 2) {
        context.report({
          node,
          message: `Return must be a two-element array like [${resName}, ${errName}]`,
        });
        return;
      }

      if (checkErrorLike) {
        let second = arg.elements[1];

        // If second element is an Identifier, try to trace its definition
        if (second.type === "Identifier") {
          const scope = context.getScope();
          const variable = scope.variables.find(
            (v: any) => v.name === second.name,
          );
          if (variable && variable.defs.length > 0) {
            const def = variable.defs[variable.defs.length - 1]; // Last definition
            if (def.node.type === "VariableDeclarator" && def.node.init) {
              second = def.node.init; // Treat as if returning the init value
            }
          }
        }

        const isErrorLike =
          (second.type === "Literal" &&
            (second.value === null || second.value === undefined)) ||
          (second.type === "Identifier" && second.name === "undefined") ||
          (second.type === "NewExpression" && second.callee.name === "Error") ||
          // Handle common error patterns, e.g., caught errors
          (second.type === "Identifier" && second.name === "e");

        if (!isErrorLike) {
          context.report({
            node: second,
            message: `The second element (${errName}) should be null, undefined, an Error instance, or a caught error.`,
          });
        }
      }
    };

    return {
      ":function": (node: any) => {
        if (isTargetFunction(node)) {
          functionStack.push(true);
          isAsync = node.async;
          hasReturn = false;
        }
      },
      ":function:exit": (node: any) => {
        if (isTargetFunction(node)) {
          functionStack.pop();
          if (!hasReturn) {
            context.report({
              node,
              message:
                "Function must explicitly return a value; no implicit undefined allowed.",
            });
          }
        }
      },
      ReturnStatement: (node: any) => {
        if (
          functionStack.length === 0 ||
          !functionStack[functionStack.length - 1]
        )
          return;
        hasReturn = true;

        let arg = node.argument;
        if (isAsync && enforceAsyncPair) {
          if (
            arg?.type === "CallExpression" &&
            arg.callee?.object?.name === "Promise" &&
            arg.callee?.property?.name === "resolve"
          ) {
            arg = arg.arguments[0]; // Unwrap Promise.resolve([res, err])
          } else if (
            arg?.type === "CallExpression" &&
            arg.callee?.object?.name === "Promise" &&
            arg.callee?.property?.name === "reject"
          ) {
            context.report({
              node,
              message:
                "Async functions should resolve with [res, err], not reject.",
            });
            return;
          } else {
            context.report({
              node,
              message:
                "Async functions should return Promise.resolve([res, err]).",
            });
            return;
          }
        }

        checkReturnArgument(arg, node);
      },
    };
  },
};

export default rule;
