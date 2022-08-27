import CategoryInMemoryRepository from "../../../domain/repository/category-in-memory.repository";
import CreateCategoryUseCase from "../create-category.use-case"

describe('CreateCategoryUseCase Unit Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeAll (() => {
    repository = new CategoryInMemoryRepository()
    useCase = new CreateCategoryUseCase(repository)
  })

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert')
    let output = await useCase.execute({ name: 'teste' })
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: 'teste',
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at
    })
    expect(spyInsert).toBeCalledTimes(1)

    output = await useCase.execute({ name: 'teste', description: 'some description', is_active: false })
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: 'teste',
      description: 'some description',
      is_active: false,
      created_at: repository.items[1].created_at
    })
    expect(spyInsert).toBeCalledTimes(2)
  })
})