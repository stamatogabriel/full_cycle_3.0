"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_entity_id_vo_1 = require("../value-objects/unique-entity-id.vo");
const entity_1 = require("./entity");
const uuid_1 = require("uuid");
class StubEntity extends entity_1.default {
}
describe('Entity unit tests', () => {
    const arrange = { prop1: 'value prop', prop2: 10 };
    const uuid = new unique_entity_id_vo_1.default();
    it('should set props and id', () => {
        const entity = new StubEntity({ prop1: 'value prop', prop2: 10 });
        expect(entity.props).toStrictEqual(arrange);
        expect(entity.uniqueEntityId).toBeInstanceOf(unique_entity_id_vo_1.default);
        expect(entity.id).not.toBe(null);
        expect((0, uuid_1.validate)(entity.id)).toBeTruthy();
    });
    it('should accept a valid uuid', () => {
        const entity = new StubEntity({ prop1: 'value prop', prop2: 10 }, uuid);
        expect(entity.uniqueEntityId).toBeInstanceOf(unique_entity_id_vo_1.default);
        expect(entity.id).toBe(uuid.value);
    });
    it('should convert a entity to a JSON', () => {
        const entity = new StubEntity({ prop1: 'value prop', prop2: 10 }, uuid);
        expect(entity.toJSON()).toStrictEqual(Object.assign({ id: entity.id }, arrange));
    });
});
