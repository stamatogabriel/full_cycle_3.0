import InvalidUuidError from "../../errors/invalid-uuid.error";
import UniqueEntityId from "../unique-entity-id.vo";
import { validate as uuidValidate } from "uuid";

const spyValidateMethod = jest.spyOn(
  UniqueEntityId.prototype as any,
  "validate"
);

beforeEach(() => spyValidateMethod.mockClear());

describe("UniqueEntityId Unit Tests", () => {
  it("should trhrow error when uuid is invalid", () => {
    expect(() => new UniqueEntityId("fake id")).toThrow(new InvalidUuidError());
    expect(spyValidateMethod).toHaveBeenCalledTimes(1);
  });

  it("should accept a uuid passed to contructor", () => {
    const uuid = "88ad5c34-b24c-4295-be98-2db7dc3699ee";
    const vo = new UniqueEntityId(uuid);
    expect(vo.value).toBe(uuid);
    expect(spyValidateMethod).toHaveBeenCalledTimes(1);
  });

  it("should not passed a uuid to contructor", () => {
    const vo = new UniqueEntityId();
    expect(uuidValidate(vo.value)).toBeTruthy();
    expect(spyValidateMethod).toHaveBeenCalledTimes(1);
  });
});
