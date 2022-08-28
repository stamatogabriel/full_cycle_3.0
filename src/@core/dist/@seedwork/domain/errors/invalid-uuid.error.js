"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidUuidError extends Error {
    constructor(message) {
        super(message || 'ID must be a valid UUID');
        this.name = "InvalidUuidError";
    }
}
exports.default = InvalidUuidError;
