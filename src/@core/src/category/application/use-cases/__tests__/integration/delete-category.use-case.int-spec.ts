import NotFoundError from  "#seedwork/domain/errors/not-found.error";
import { DeleteCategoryUseCase } from "../../delete-category.use-case"
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  const { CategoryModel, CategoryRepository } = CategorySequelize

  setupSequelize({ models: [CategorySequelize.CategoryModel] })

  beforeAll(() => {
    repository = new CategoryRepository(CategoryModel)
    useCase = new DeleteCategoryUseCase.UseCase(repository)
  })

  it('should trhows error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' }))
      .rejects
      .toThrow(new NotFoundError(`Entity not found using ID fake id`))
  })

  it('should delete a category', async () => {
    const model = await CategoryModel.factory().create()

    const output = await useCase.execute({ id: model.id })
    expect(output).toStrictEqual({ message: 'category successfully deleted' })

    const categoryFound = await CategoryModel.findByPk(model.id)
    expect(categoryFound).toBeNull()
  })
})