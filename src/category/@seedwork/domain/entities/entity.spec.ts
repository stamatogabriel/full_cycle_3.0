import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import Entity from "./entity";

import { validate as UuidValidate } from 'uuid'

class StubEntity extends Entity<{ prop1: string, prop2: number }> { }

describe('Entity unit tests', () => {
  const arrange = { prop1: 'value prop', prop2: 10 }
  const uuid = new UniqueEntityId();

  it('should set props and id', () => {
    const entity = new StubEntity({ prop1: 'value prop', prop2: 10 })
    
    expect(entity.props).toStrictEqual(arrange)
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(entity.id).not.toBe(null)
    expect(UuidValidate(entity.id)).toBeTruthy()
  })

  it('should accept a valid uuid', () => {
    const entity = new StubEntity({ prop1: 'value prop', prop2: 10 }, uuid)

    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(entity.id).toBe(uuid.value)
  })

  it('should convert a entity to a JSON', () => {
    const entity = new StubEntity({ prop1: 'value prop', prop2: 10 }, uuid)

    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      ...arrange
    })
  })
})