import { Category } from "#category/domain/entities/category";
import NotFoundError from "#seedwork/domain/errors/not-found.error";
import { UpdateCategoryUseCase } from "../../update-category.use-case"
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CategoryFakeBuilder } from "#category/domain/entities/category-fake-factory";

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  const { CategoryModel, CategoryRepository } = CategorySequelize

  setupSequelize({ models: [CategorySequelize.CategoryModel] })

  beforeAll(() => {
    repository = new CategoryRepository(CategoryModel)
    useCase = new UpdateCategoryUseCase.UseCase(repository)
  })

  it('should trhows error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id', name: 'Movie' }))
      .rejects
      .toThrow(new NotFoundError(`Entity not found using ID fake id`))
  })

  it('should update a category', async () => {
    const model = CategoryFakeBuilder.aCategory().build()
    repository.insert(model)

    const arrange: any[] = [
      {
        entity: {
          name: 'teste',
          id: model.id,
        },
        expected: {
          id: model.id,
          name: 'teste',
          description: null,
          is_active: true,
          created_at: model.created_at
        },
      },
      {
        entity: {
          id: model.id,
          name: 'teste',
          description: 'some description',
        },
        expected: {
          id: model.id,
          name: 'teste',
          description: 'some description',
          is_active: true,
          created_at: model.created_at
        },
      },
      {
        entity: {
          name: 'teste',
          id: model.id,
        },
        expected: {
          id: model.id,
          name: 'teste',
          description: null,
          is_active: true,
          created_at: model.created_at
        },
      },
      {
        entity: {
          name: 'teste',
          id: model.id,
          is_active: false
        },
        expected: {
          id: model.id,
          name: 'teste',
          description: null,
          is_active: false,
          created_at: model.created_at
        },
      },
      {
        entity: {
          name: 'teste',
          id: model.id,
          is_active: true
        },
        expected: {
          id: model.id,
          name: 'teste',
          description: null,
          is_active: true,
          created_at: model.created_at
        },
      },
      {
        entity: {
          name: 'teste',
          description: 'some description',
          id: model.id,
          is_active: false
        },
        expected: {
          id: model.id,
          name: 'teste',
          description: 'some description',
          is_active: false,
          created_at: model.created_at
        },
      }
    ]

    for (const i of arrange) {
      let output = await useCase.execute(i.entity)
      expect(output).toStrictEqual(i.expected)
    }
  })
})