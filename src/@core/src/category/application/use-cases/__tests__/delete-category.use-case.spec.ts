import NotFoundError from  "#seedwork/domain/errors/not-found.error";
import { Category } from "#category/domain/entities/category";
import CategoryInMemoryRepository from "#category/domain/repository/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../delete-category.use-case"

describe('DeleteCategoryUseCase Unit Tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;

  beforeAll(() => {
    repository = new CategoryInMemoryRepository()
    useCase = new DeleteCategoryUseCase.UseCase(repository)
  })

  it('should trhows error when entity not found', async () => {
    expect(() => useCase.execute({ id: 'fake id' }))
      .rejects
      .toThrow(new NotFoundError(`Entity not found using ID fake id`))
  })

  it('should delete a category', async () => {
    const spyDelete = jest.spyOn(repository, 'delete')
    const category = new Category({ name: 'Movie' })

    repository.items = [category]

    const output = await useCase.execute({ id: category.id })
    expect(output).toStrictEqual({ message: 'category successfully deleted' })
    expect(repository.items).toHaveLength(0)
    expect(spyDelete).toBeCalledTimes(1)
  })
})