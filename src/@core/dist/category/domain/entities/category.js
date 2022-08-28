"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const entity_1 = require("#seedwork/domain/entities/entity");
const category_validator_1 = require("../validators/category.validator");
const validation_error_1 = require("#seedwork/domain/errors/validation-error");
class Category extends entity_1.default {
    constructor(props, id) {
        var _a, _b;
        Category.validate(props);
        super(props, id);
        this.props = props;
        this.description = this.props.description;
        this.is_active = (_a = this.props.is_active) !== null && _a !== void 0 ? _a : true;
        this.props.created_at = (_b = this.props.created_at) !== null && _b !== void 0 ? _b : new Date();
    }
    update(updateData) {
        Category.validate(updateData);
        this.name = updateData.name;
        this.description = updateData.description;
    }
    static validate(props) {
        const validator = category_validator_1.default.create();
        const isValid = validator.validate(props);
        if (!isValid)
            throw new validation_error_1.EntityValidationError(validator.errors);
    }
    activate() {
        this.is_active = true;
    }
    deactivate() {
        this.is_active = false;
    }
    get name() {
        return this.props.name;
    }
    set name(value) {
        this.props.name = value;
    }
    get description() {
        return this.props.description;
    }
    set description(value) {
        this.props.description = value !== null && value !== void 0 ? value : null;
    }
    get is_active() {
        return this.props.is_active;
    }
    set is_active(value) {
        this.props.is_active = value !== null && value !== void 0 ? value : true;
    }
    get created_at() {
        return this.props.created_at;
    }
}
exports.Category = Category;
