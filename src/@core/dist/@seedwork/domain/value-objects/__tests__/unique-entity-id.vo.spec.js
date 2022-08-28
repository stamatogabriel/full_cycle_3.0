"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invalid_uuid_error_1 = require("../../errors/invalid-uuid.error");
const unique_entity_id_vo_1 = require("../unique-entity-id.vo");
const uuid_1 = require("uuid");
const spyValidateMethod = jest.spyOn(unique_entity_id_vo_1.default.prototype, "validate");
beforeEach(() => spyValidateMethod.mockClear());
describe("UniqueEntityId Unit Tests", () => {
    it("should trhrow error when uuid is invalid", () => {
        expect(() => new unique_entity_id_vo_1.default("fake id")).toThrow(new invalid_uuid_error_1.default());
        expect(spyValidateMethod).toHaveBeenCalledTimes(1);
    });
    it("should accept a uuid passed to contructor", () => {
        const uuid = "88ad5c34-b24c-4295-be98-2db7dc3699ee";
        const vo = new unique_entity_id_vo_1.default(uuid);
        expect(vo.value).toBe(uuid);
        expect(spyValidateMethod).toHaveBeenCalledTimes(1);
    });
    it("should not passed a uuid to contructor", () => {
        const vo = new unique_entity_id_vo_1.default();
        expect((0, uuid_1.validate)(vo.value)).toBeTruthy();
        expect(spyValidateMethod).toHaveBeenCalledTimes(1);
    });
});
