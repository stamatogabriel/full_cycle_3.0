import { ClassValidatorFields } from "../validators/class-validator-fields"
import { FieldsErrors } from "../validators/validator-fields-interface";
import { objectContaining } from 'expect'
import { EntityValidationError } from "../errors/validation-error";

type Expect = {
  validator: ClassValidatorFields<any>;
  data: any
} | (() => any)

expect.extend({
  containsErrorMessages(expected: Expect, received: FieldsErrors) {
    if (typeof expected === 'function') {
      try {
        expected()
        isValid()
      } catch (e) {
        const error = e as EntityValidationError

        return assertContainsErrorsMessages(error.error, received)
      }
    } else {
      const { data, validator } = expected
      const validated = validator.validate(data)

      if (validated) return isValid()

      return assertContainsErrorsMessages(validator.errors, received)
    }
  }
})

function isValid() {
  return {
    pass: false,
    message: () => "The data is valid"
  }
}

function assertContainsErrorsMessages(expected: FieldsErrors, received: FieldsErrors) {
  const isMatch = objectContaining(received).asymmetricMatch(expected)

  return isMatch ? {
    pass: true,
    message: () => ""
  } : {
    pass: false,
    message: () => `The validation erros not contains ${JSON.stringify(received)}. Current ${JSON.stringify(expected)}`
  }
}