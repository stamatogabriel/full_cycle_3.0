import { CategoryProps } from "../entities/category"
import CategoryValidatorFactory, { CategoryRules, CategoryValidator } from "./category.validator"

describe('Category Validator Tests', () => {
  let validator: CategoryValidator

  beforeEach(() => validator = CategoryValidatorFactory.create())
  test('invalidation cases for name field', () => {
    let isValid = validator.validate(null)
    expect(isValid).toBeFalsy()
    expect(validator.errors.name).toStrictEqual(
      [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ],
    )

    isValid = validator.validate({ name: '' })
    expect(isValid).toBeFalsy()
    expect(validator.errors.name).toStrictEqual(
      [
        'name should not be empty',
      ],
    )

    isValid = validator.validate({ name: 5 as any })
    expect(isValid).toBeFalsy()
    expect(validator.errors.name).toStrictEqual(
      [
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ],
    )

    isValid = validator.validate({ name: "t".repeat(256) })
    expect(isValid).toBeFalsy()
    expect(validator.errors.name).toStrictEqual(
      [
        'name must be shorter than or equal to 255 characters'
      ],
    )
  })

  test('valid cases for fields', () => {
    const arrange: CategoryProps[] = [
      {name: 'some value'},
      {name: 'some value', description: undefined},
      {name: 'some value', description: null},
      {name: 'some value', description: 'some description'},
      {name: 'some value', is_active: true},
      {name: 'some value', is_active: false}
    ]

    arrange.forEach((item: CategoryProps) => {
      const isValid = validator.validate(item)
      expect(isValid).toBeTruthy()
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item))
    })
  })
})