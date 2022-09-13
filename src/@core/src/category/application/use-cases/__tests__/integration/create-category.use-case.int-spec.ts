import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CreateCategoryUseCase } from "../../create-category.use-case"

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  const { CategoryModel, CategoryRepository } = CategorySequelize

  setupSequelize({ models: [CategorySequelize.CategoryModel] })

  beforeAll (() => {
    repository = new CategoryRepository(CategoryModel)
    useCase = new CreateCategoryUseCase.UseCase(repository)
  })

  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'teste' })
    let entity = await repository.findById(output.id)
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'teste',
      description: null,
      is_active: true,
      created_at: entity.created_at
    })

    output = await useCase.execute({ name: 'teste', description: 'some description', is_active: false })
    entity = await repository.findById(output.id)
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'teste',
      description: 'some description',
      is_active: false,
      created_at: entity.created_at
    })

    output = await useCase.execute({ name: 'teste', description: 'some description', is_active: true })
    entity = await repository.findById(output.id)
    expect(output).toStrictEqual({
      id: entity.id,
      name: 'teste',
      description: 'some description',
      is_active: true,
      created_at: entity.created_at
    })
  })
})