"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_1 = require("./object");
describe('object unit tests', () => {
    it('shoud not freeze a scalar value', () => {
        const str = (0, object_1.deepFreeze)('a');
        expect(typeof str).toBe('string');
        let boolean = (0, object_1.deepFreeze)(true);
        expect(typeof boolean).toBe('boolean');
        boolean = (0, object_1.deepFreeze)(false);
        expect(typeof boolean).toBe('boolean');
        const num = (0, object_1.deepFreeze)(5);
        expect(typeof num).toBe('number');
    });
    it('should to be a immutable obj', () => {
        const obj = (0, object_1.deepFreeze)({
            prop1: 'value1',
            deep: {
                prop2: 'value2',
                prop3: new Date()
            }
        });
        expect(() => obj.prop1 = 'test')
            .toThrow("Cannot assign to read only property 'prop1' of object '#<Object>'");
        expect(() => obj.deep.prop2 = 'test')
            .toThrow("Cannot assign to read only property 'prop2' of object '#<Object>'");
        expect(obj.deep.prop3).toBeInstanceOf(Date);
    });
});
