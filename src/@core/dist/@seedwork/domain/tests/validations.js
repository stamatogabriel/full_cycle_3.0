"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = require("expect");
expect.extend({
    containsErrorMessages(expected, received) {
        if (typeof expected === 'function') {
            try {
                expected();
                isValid();
            }
            catch (e) {
                const error = e;
                return assertContainsErrorsMessages(error.error, received);
            }
        }
        else {
            const { data, validator } = expected;
            const validated = validator.validate(data);
            if (validated)
                return isValid();
            return assertContainsErrorsMessages(validator.errors, received);
        }
    }
});
function isValid() {
    return {
        pass: false,
        message: () => "The data is valid"
    };
}
function assertContainsErrorsMessages(expected, received) {
    const isMatch = (0, expect_1.objectContaining)(received).asymmetricMatch(expected);
    return isMatch ? {
        pass: true,
        message: () => ""
    } : {
        pass: false,
        message: () => `The validation erros not contains ${JSON.stringify(received)}. Current ${JSON.stringify(expected)}`
    };
}
