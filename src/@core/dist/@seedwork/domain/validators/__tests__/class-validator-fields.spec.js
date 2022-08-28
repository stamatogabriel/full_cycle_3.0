"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_fields_1 = require("../class-validator-fields");
const libClassValidator = require("class-validator");
class StubClassValidatorFields extends class_validator_fields_1.ClassValidatorFields {
}
describe('Class Validator Fields Unit Tests', () => {
    it('should initialize erros and validatedData variables with null', () => {
        const validator = new StubClassValidatorFields();
        expect(validator.errors).toBeNull();
        expect(validator.validatedData).toBeNull();
    });
    it('should validate with errors', () => {
        const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
        spyValidateSync.mockReturnValue([
            { property: 'field', constraints: { isRequired: 'some error' } }
        ]);
        const validator = new StubClassValidatorFields();
        expect(validator.validate(null)).toBeFalsy();
        expect(spyValidateSync).toHaveBeenCalled();
        expect(validator.validatedData).toBeNull();
        expect(validator.errors).toStrictEqual({ field: ['some error'] });
    });
    it('should validate without errors', () => {
        const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
        spyValidateSync.mockReturnValue([]);
        const validator = new StubClassValidatorFields();
        expect(validator.validate({ field: 'value' })).toBeTruthy();
        expect(spyValidateSync).toHaveBeenCalled();
        expect(validator.validatedData).toStrictEqual({ field: 'value' });
        expect(validator.errors).toBeNull();
    });
});
