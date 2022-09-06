import { Category } from "#category/domain";
import { InvalidUuidError, LoadEntityError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category-model";
import { CategoryModelMapper } from "../category.mapper";

describe('CategoryModelMapper Unit Tests', () => {
  setupSequelize({
    models: [CategoryModel]
  })

  it('should throws error when category id is invalid', () => {
    const model = CategoryModel.build({ id: 'fake id' })
    expect(() => CategoryModelMapper.toEntity(model)).toThrow(new InvalidUuidError('ID must be a valid UUID'))
  })

  it('should throws error when category is invalid', () => {
    const model = CategoryModel.build({ id: '88ad5c34-b24c-4295-be98-2db7dc3699ee' })
    try {
      CategoryModelMapper.toEntity(model)
      fail('The category is valid, but must be throws a LoadEntityError')
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError)
      expect(e.error).toMatchObject({
        name: [
          'name should not be empty',
          "name must be a string",
          "name must be shorter than or equal to 255 characters"
        ]
      })
    }
  })

  it('should convert a category model to a category entity', () => {
    const created_at = new Date()
    const model = CategoryModel.build({
      id: '88ad5c34-b24c-4295-be98-2db7dc3699ee',
      name: 'movie',
      description: 'some description',
      is_active: true,
      created_at
    })
    const entity = CategoryModelMapper.toEntity(model)

    expect(entity.toJSON()).toStrictEqual(
      new Category({
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at
      },
        new UniqueEntityId('88ad5c34-b24c-4295-be98-2db7dc3699ee')
      ).toJSON()
    )
  })

  it('should throw a generic error', async () => {
    const error = new Error('Generic Error')
    const spyValidate = jest.spyOn(Category, 'validate').mockImplementation(() => { throw error })
    const model = CategoryModel.build({ id: '88ad5c34-b24c-4295-be98-2db7dc3699ee' })

    expect(() => CategoryModelMapper.toEntity(model)).toThrow(error)
    expect(spyValidate).toHaveBeenCalled()
  })
})