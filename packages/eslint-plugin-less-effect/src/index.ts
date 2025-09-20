import resErrReturnRule from "./rules/res-err-return-rule";
import resErrAsyncReturnRule from "./rules/res-err-async-return-rule";
import requireZodParameterValidationRule from "./rules/require-zod-parameter-validation";
const rules = {
  "res-err-return-rule": resErrReturnRule,
  "res-err-async-return-rule": resErrAsyncReturnRule,
  "require-zod-parameter-validation-rule": requireZodParameterValidationRule,
};

export default rules;
