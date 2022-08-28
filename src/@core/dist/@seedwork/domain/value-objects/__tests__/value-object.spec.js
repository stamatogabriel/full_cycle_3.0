"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const value_object_1 = require("../value-object");
class StubValueObject extends value_object_1.default {
}
describe('Value Object Unit Teste', () => {
    it('shoud set value', () => {
        let vo = new StubValueObject('string value');
        expect(vo.value).toBe('string value');
        vo = new StubValueObject({ prop1: 'value1' });
        expect(vo.value).toStrictEqual({ prop1: 'value1' });
    });
    it('should convert to a string', () => {
        const date = new Date();
        let arrange = [
            { received: "", expected: "" },
            { received: "fake test", expected: "fake test" },
            { received: 0, expected: "0" },
            { received: true, expected: "true" },
            { received: false, expected: "false" },
            { received: date, expected: date.toString() },
            { received: { prop1: 'value1' }, expected: JSON.stringify({ prop1: 'value1' }) }
        ];
        arrange.forEach((value) => {
            let vo = new StubValueObject(value.received);
            expect(vo + "").toBe(value.expected);
        });
    });
    it('should to be a immutable obj', () => {
        const obj = {
            prop1: 'value1',
            deep: {
                prop2: 'value2',
                prop3: new Date()
            }
        };
        const vo = new StubValueObject(obj);
        expect(() => vo.value.prop1 = 'test')
            .toThrow("Cannot assign to read only property 'prop1' of object '#<Object>'");
        expect(() => vo.value.deep.prop2 = 'test')
            .toThrow("Cannot assign to read only property 'prop2' of object '#<Object>'");
        expect(vo.value.deep.prop3).toBeInstanceOf(Date);
    });
});
