export default abstract class ValueObject<Value = any> {
    protected readonly _value: Value;
    constructor(value: Value);
    get value(): Value;
    toString: () => string;
}
