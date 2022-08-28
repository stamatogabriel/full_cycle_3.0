"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_error_1 = require("../../errors/validation-error");
const validator_rules_1 = require("../validator-rules");
function assertIsInvalid(expected) {
    expect(() => {
        runRule(expected);
    }).toThrow(expected.error);
}
function assertIsValid(expected) {
    expect(() => {
        runRule(expected);
    }).not.toThrow(expected.error);
}
function runRule({ value, property, rule, params = [] }) {
    const validator = validator_rules_1.default.values(value, property);
    const method = validator[rule];
    method.apply(validator, params);
}
describe("ValidatorRules unit test", () => {
    test("values method", () => {
        const validator = validator_rules_1.default.values("value", "field");
        expect(validator).toBeInstanceOf(validator_rules_1.default);
        expect(validator["value"]).toBe("value");
        expect(validator["property"]).toBe("field");
    });
    test("required validation rule", () => {
        let arrange = [
            { value: null, property: 'field' },
            { value: undefined, property: 'field' },
            { value: "", property: 'field' },
        ];
        const error = new validation_error_1.ValidationError("The field is required.");
        arrange.forEach(t => {
            assertIsInvalid({
                value: t.value,
                property: t.property,
                rule: "required",
                error,
            });
        });
        arrange = [
            { value: 'value', property: 'field' },
            { value: 5, property: 'field' },
            { value: 0, property: 'field' },
            { value: true, property: 'field' },
        ];
        arrange.forEach(t => {
            assertIsValid({
                value: t.value,
                property: t.property,
                rule: "required",
                error,
            });
        });
    });
    test("string validation rule", () => {
        let arrange = [
            { value: 5, property: 'field' },
            { value: {}, property: 'field' },
            { value: false, property: 'field' },
        ];
        const error = new validation_error_1.ValidationError("The field must be a string.");
        arrange.forEach(t => {
            assertIsInvalid({
                value: t.value,
                property: t.property,
                rule: "string",
                error,
            });
        });
        arrange = [
            { value: null, property: 'field' },
            { value: undefined, property: 'field' },
            { value: 'value', property: 'field' },
        ];
        arrange.forEach(t => {
            assertIsValid({
                value: t.value,
                property: t.property,
                rule: "string",
                error,
            });
        });
    });
    test("max length validation rule", () => {
        let arrange = [
            { value: "7777", property: 'field' },
            { value: "Three", property: 'field' },
        ];
        const error = new validation_error_1.ValidationError("The field exceeds the maximum lenght of 3.");
        arrange.forEach(t => {
            assertIsInvalid({
                value: t.value,
                property: t.property,
                rule: "maxLength",
                error,
                params: [3]
            });
        });
        arrange = [
            { value: null, property: 'field' },
            { value: undefined, property: 'field' },
            { value: 'one', property: 'field' },
        ];
        arrange.forEach(t => {
            assertIsValid({
                value: t.value,
                property: t.property,
                rule: "maxLength",
                error,
                params: [3]
            });
        });
    });
    test("boolean validation rule", () => {
        let arrange = [
            { value: 1, property: 'field' },
            { value: "true", property: 'field' },
        ];
        const error = new validation_error_1.ValidationError("The field must be a boolean.");
        arrange.forEach(t => {
            assertIsInvalid({
                value: t.value,
                property: t.property,
                rule: "boolean",
                error,
            });
        });
        arrange = [
            { value: null, property: 'field' },
            { value: undefined, property: 'field' },
            { value: false, property: 'field' },
            { value: true, property: 'field' },
        ];
        arrange.forEach(t => {
            assertIsValid({
                value: t.value,
                property: t.property,
                rule: "boolean",
                error,
            });
        });
    });
    it("should throw a validation error when combine two or more validation rules", () => {
        let validator = validator_rules_1.default.values(null, "field");
        expect(() => {
            validator.required().string().maxLength(5);
        }).toThrow(new validation_error_1.ValidationError("The field is required."));
        validator = validator_rules_1.default.values(5, "field");
        expect(() => {
            validator.required().string().maxLength(5);
        }).toThrow(new validation_error_1.ValidationError("The field must be a string."));
        validator = validator_rules_1.default.values("aaaaaa", "field");
        expect(() => {
            validator.required().string().maxLength(5);
        }).toThrow(new validation_error_1.ValidationError("The field exceeds the maximum lenght of 5."));
        validator = validator_rules_1.default.values(null, "field");
        expect(() => {
            validator.required().boolean();
        }).toThrow(new validation_error_1.ValidationError("The field is required."));
        validator = validator_rules_1.default.values(5, "field");
        expect(() => {
            validator.required().boolean();
        }).toThrow(new validation_error_1.ValidationError("The field must be a boolean."));
    });
    it("should be valid when combine two or more validation rules", () => {
        expect.assertions(0);
        validator_rules_1.default.values("test", "field").required().string();
        validator_rules_1.default.values("aaaaa", "field").required().string().maxLength(5);
        validator_rules_1.default.values(true, "field").required().boolean();
        validator_rules_1.default.values(false, "field").required().boolean();
    });
});
