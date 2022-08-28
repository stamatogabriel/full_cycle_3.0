"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassValidatorFields = void 0;
const class_validator_1 = require("class-validator");
class ClassValidatorFields {
    constructor() {
        this.errors = null;
        this.validatedData = null;
    }
    validate(data) {
        const errors = (0, class_validator_1.validateSync)(data);
        if (errors.length) {
            this.errors = {};
            for (const error of errors) {
                const field = error.property;
                this.errors[field] = Object.values(error.constraints);
            }
        }
        else {
            this.validatedData = data;
        }
        return !errors.length;
    }
}
exports.ClassValidatorFields = ClassValidatorFields;
