import { Category } from "../../../domain/entities/category";
import NotFoundError from  "#seedwork/domain/errors/not-found.error";
import CategoryInMemoryRepository from "../../../domain/repository/category-in-memory.repository";
import GetCategoryUseCase from "../get-category.use-case"

describe('GetCategoryUseCase Unit Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeAll(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new GetCategoryUseCase(repository)
  })

  it('should trhows error when entity not found', async () => {
    expect(() => useCase.execute({ id: 'fake id' }))
      .rejects
      .toThrow(new NotFoundError(`Entity not found using ID fake id`))
  })

  it('should returns a category', async () => {
    const items = [
      new Category({name: 'movie'})
    ]

    repository.items = items
    const spyFindById = jest.spyOn(repository, 'findById')

    const output = await useCase.execute({ id: items[0].id })
    
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: 'movie',
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at
    })
    expect(spyFindById).toBeCalledTimes(1)
    })
})