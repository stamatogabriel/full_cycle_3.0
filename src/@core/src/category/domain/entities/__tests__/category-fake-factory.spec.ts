import { UniqueEntityId } from "#seedwork/domain"
import { Chance } from "chance"
import { CategoryFakeBuilder } from "../category-fake-factory"

describe('CategoryFakeFactory Unit Tests', () => {
  describe('name prop', () => {
    const faker = CategoryFakeBuilder.aCategory()
    it('should be a function', () => {
      expect(typeof faker['_name'] === 'function').toBeTruthy()
    })

    it('should call the word method', () => {
      const chance = Chance()
      const spyWordMethod = jest.spyOn(chance, 'word')
      faker['chance'] = chance
      faker.build()
      expect(spyWordMethod).toHaveBeenCalled()
    })

    test('withName', () => {
      faker.withName('test name')
      expect(faker['_name']).toBe('test name')

      faker.withName(() => 'test name')
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name')
      expect(faker.name).toBe('test name')
    })

    it('shoul pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`)
      const category = faker.build()
      expect(category.name).toBe('test name 0')

      const fakerMany = CategoryFakeBuilder.theCategories(2)
      fakerMany.withName((index) => `test name ${index}`)
      const categories = fakerMany.build()
      expect(categories[0].name).toBe('test name 0')
      expect(categories[1].name).toBe('test name 1')
    })

    test('invalid empty case', () => {
      faker.withInvalidEmptyName(undefined)
      expect(faker['_name']).toBeUndefined()

      faker.withInvalidEmptyName(null)
      expect(faker['_name']).toBeNull()

      faker.withInvalidEmptyName('')
      expect(faker['_name']).toBe('')
    })

    test('to long name', () => {
      faker.whithInvalidNameToLong()
      expect(faker['_name'].length).toBe(256)

      faker.whithInvalidNameToLong('a'.repeat(256))
      expect(faker['_name'].length).toBe(256)
      expect(faker['_name']).toBe('a'.repeat(256))
    })

    test('not a string', () => {
      faker.withInvalidNameNotAString()
      expect(faker['_name']).toBe(5)

      faker.withInvalidNameNotAString(true)
      expect(faker['_name']).toBe(true)
    })
  })

  describe('description prop', () => {
    const faker = CategoryFakeBuilder.aCategory()
    it('should be a function', () => {
      expect(typeof faker['_description'] === 'function').toBeTruthy()
    })

    it('should call the paragraph method', () => {
      const chance = Chance()
      const spyParagraphMethod = jest.spyOn(chance, 'paragraph')
      faker['chance'] = chance
      faker.build()
      expect(spyParagraphMethod).toHaveBeenCalled()
    })

    test('withDescription', () => {
      faker.withDescription('some description')
      expect(faker['_description']).toBe('some description')

      faker.withDescription(() => 'some description')
      //@ts-expect-error description is callable
      expect(faker['_description']()).toBe('some description')

      expect(faker.description).toBe('some description')
    })

    it('shoul pass index to description factory', () => {
      faker.withDescription((index) => `test description ${index}`)
      const category = faker.build()
      expect(category.description).toBe('test description 0')

      const fakerMany = CategoryFakeBuilder.theCategories(2)
      fakerMany.withDescription((index) => `test description ${index}`)
      const categories = fakerMany.build()
      expect(categories[0].description).toBe('test description 0')
      expect(categories[1].description).toBe('test description 1')
    })

    test('not a string', () => {
      faker.withInvalidDescriptionNotAString()
      expect(faker['_description']).toBe(5)

      faker.withInvalidDescriptionNotAString(true)
      expect(faker['_description']).toBe(true)
    })
  })

  describe('is_active prop', () => {
    const faker = CategoryFakeBuilder.aCategory()
    it('should be a function', () => {
      expect(typeof faker['_is_active'] === 'function').toBeTruthy()
    })

    test('activate', () => {
      faker.activate()
      expect(faker['_is_active']).toBeTruthy()

      expect(faker.is_active).toBeTruthy()
    })

    test('deactivate', () => {
      faker.deactivate()
      expect(faker['_is_active']).toBeFalsy()

      expect(faker.is_active).toBeFalsy()
    })

    test('not a boolean', () => {
      faker.withInvalidIsActiveNotABoolean()
      expect(faker['_is_active']).toBe('fake boolean')
      expect(faker.is_active).toBe('fake boolean')

      faker.withInvalidIsActiveNotABoolean(5)
      expect(faker['_is_active']).toBe(5)
      expect(faker.is_active).toBe(5)
    })


    test('invalid empty case', () => {
      faker.withInvalidEmptyIsActive(undefined)
      expect(faker['_is_active']).toBeUndefined()

      faker.withInvalidEmptyIsActive(null)
      expect(faker['_is_active']).toBeNull()

      faker.withInvalidEmptyIsActive('')
      expect(faker['_is_active']).toBe('')
    })
  })

  describe('unique_entity_id prop', () => {
    const faker = CategoryFakeBuilder.aCategory()

    it('should throw error when any with methods has called', () => {
      expect(() => faker['getValue']('unique_entity_id')).toThrow(
        new Error(
          `Property unique_entity_id not have a factory, use with methods`
        )
      )
    })

    it('should be undefined', () => {
      expect(faker['_unique_entity_id']).toBeUndefined
    })

    test('with Unique Entity Id', () => {
      const uniqueEntityId = new UniqueEntityId();
      const $this = faker.withUniqueEntityId(uniqueEntityId)
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_unique_entity_id']).toBe(uniqueEntityId)

      faker.withUniqueEntityId(() => uniqueEntityId)
      expect(faker['_unique_entity_id']()).toBe(uniqueEntityId)

      expect(faker.unique_entity_id).toBe(uniqueEntityId)

    })

    it('should pass index to unique_entity_id factory', () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId)
      faker.withUniqueEntityId(mockFactory)
      faker.build()
      expect(mockFactory).toHaveBeenCalledWith(0)

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId)
      const fakerMany = CategoryFakeBuilder.theCategories(2)
      fakerMany.withUniqueEntityId(mockFactory)
      fakerMany.build()

      expect(mockFactory).toHaveBeenCalledWith(0)
      expect(mockFactory).toHaveBeenCalledWith(1)
    })
  })

  describe('created_at prop', () => {
    const faker = CategoryFakeBuilder.aCategory()

    it('should throw error when any with methods has called', () => {
      expect(() => faker['getValue']('created_at')).toThrow(
        new Error(
          `Property created_at not have a factory, use with methods`
        )
      )
    })

    it('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined
    })

    test('with Date', () => {
      const createdAt = new Date();
      const $this = faker.withCreatedAt(createdAt)
      expect($this).toBeInstanceOf(CategoryFakeBuilder)
      expect(faker['_created_at']).toBe(createdAt)

      faker.withCreatedAt(() => createdAt)
      expect(faker['_created_at']()).toBe(createdAt)

      expect(faker.created_at).toBe(createdAt)
    })

    it('should pass index to created_at factory', () => {
      const date = new Date

      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const category = faker.build()
      expect(category.created_at.getTime()).toBe(date.getTime() + 2)

      const fakerMany = CategoryFakeBuilder.theCategories(2)
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2))
      const categories = fakerMany.build()
      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2)
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 1 + 2)

    })
  })
})