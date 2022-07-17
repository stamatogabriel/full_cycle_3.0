import { Category, CategoryProps } from './category'

describe('Category Unit Tests', () => {
  const mockCategory: CategoryProps = {
    name: 'Movie',
    description: 'description',
    is_active: true,
    created_at: new Date()
  }

  test('category s constructor', () => {
    const category = new Category(mockCategory)
    expect(category.props).toStrictEqual(mockCategory)
  })

  test('category s constructos with only name', () => {
    const created_at = new Date()
    const category = new Category({name: 'Movie name', created_at})

    expect(category.props).toStrictEqual({
      name: 'Movie name',
      description: null,
      is_active: true,
      created_at
    })
  })
})
