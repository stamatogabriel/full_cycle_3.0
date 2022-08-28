"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityValidationError = exports.ValidationError = void 0;
class ValidationError extends Error {
}
exports.ValidationError = ValidationError;
class EntityValidationError extends Error {
    constructor(error) {
        super('Entity Validation Error');
        this.error = error;
        this.name = 'Entity Validation Error';
    }
}
exports.EntityValidationError = EntityValidationError;
