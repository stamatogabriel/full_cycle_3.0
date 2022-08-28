import { Category } from "#category/domain/entities/category"
import { CategoryOutputMapper } from "./category-output"

describe('CategoryOutputMapper Unit Tests', () => {
  it('shoud convert a category in output', () => {
    const created_at = new Date()
    const category = new Category({
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at
    })
    const spyToJson = jest.spyOn(category, 'toJSON')
    
    const output = CategoryOutputMapper.toOutput(category)
    expect(output).toStrictEqual({
      id: category.id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at
    })
    expect(spyToJson).toBeCalledTimes(1)
  })
})