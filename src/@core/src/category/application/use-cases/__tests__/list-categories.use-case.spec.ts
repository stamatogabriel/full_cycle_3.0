import { Category } from "#category/domain/entities/category";
import CategoryInMemoryRepository from "#category/domain/repository/category-in-memory.repository";
import { CategoryRepositoryContract as CategoryRepository } from "#category/domain/repository/category.repository";
import { ListCategoriesUseCase } from "../list-categories.use-case";

describe('ListCategoriesUseCase Unit Tests', () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeAll(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new ListCategoriesUseCase.UseCase(repository)
  })

  test('to output', () => {
    let result = new CategoryRepository.SearchResult({
      items: [],
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      total: 1
    })

    let output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [],
      current_page: 1,
      per_page: 2,
      last_page: 1,
      total: 1
    })

    const category = new Category({
      name: 'Movie',
    })

    result = new CategoryRepository.SearchResult({
      items: [category],
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      total: 1
    })

    output = useCase['toOutput'](result)
    expect(output).toStrictEqual({
      items: [category.toJSON()],
      current_page: 1,
      per_page: 2,
      last_page: 1,
      total: 1
    })
  })

  it('should resturn output using empty input with categories ordered by created_at', async () => {
    const created_at = new Date()

    const items = [
      new Category({ name: 'teste 1', created_at: new Date(created_at.getTime()) }),
      new Category({ name: 'teste 2', created_at: new Date(created_at.getTime() + 100) }),
    ]

    repository.items = items

    const output = await useCase.execute({})
    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      current_page: 1,
      per_page: 15,
      last_page: 1,
      total: 2
    })
  })

  it('should returns outpu using sort and filter', async () => {
    const items = [
      new Category({ name: 'a' }),
      new Category({ name: 'AAA' }),
      new Category({ name: 'AaA' }),
      new Category({ name: 'b' }),
      new Category({ name: 'c' }),
    ]

    repository.items = items

    let output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', filter: 'a' })
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      current_page: 1,
      per_page: 2,
      last_page: 2,
      total: 3
    })

    output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', filter: 'a' })
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      current_page: 2,
      per_page: 2,
      last_page: 2,
      total: 3
    })

    output = await useCase.execute({ page: 1, per_page: 2, sort_dir: 'desc', sort: 'name', filter: 'a' })
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON()],
      current_page: 1,
      per_page: 2,
      last_page: 2,
      total: 3
    })
  })
})