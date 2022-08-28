"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("../utils/object");
class ValueObject {
    constructor(value) {
        this.toString = () => {
            if (typeof this.value !== "object" || this.value === null) {
                try {
                    return this.value.toString();
                }
                catch (error) {
                    return this.value + "";
                }
            }
            const valueStr = this.value.toString();
            return valueStr === "[object Object]" ? JSON.stringify(this.value) : valueStr;
        };
        this._value = (0, object_1.deepFreeze)(value);
    }
    get value() {
        return this._value;
    }
}
exports.default = ValueObject;
