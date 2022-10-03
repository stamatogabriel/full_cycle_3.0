import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { ListCategoriesUseCase } from "../../list-categories.use-case";
import _chance from 'chance'
import { Category } from "#category/domain";

const chance = _chance()

describe('ListCategoriesUseCase Integration Tests', () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  const { CategoryModel, CategoryRepository } = CategorySequelize

  setupSequelize({ models: [CategorySequelize.CategoryModel] })

  beforeAll(() => {
    repository = new CategoryRepository(CategoryModel)
    useCase = new ListCategoriesUseCase.UseCase(repository)
  })

  it('should return output using empty input with categories ordered by created_at', async () => {
    const faker = Category.fake().theCategories(2)

    const models = faker
      .withName((index) => `Category ${index}`)
      .withCreatedAt((index) => new Date(new Date().getTime() + index))
      .build()

    repository.bulkInsert(models)

    const output = await useCase.execute({})
    expect(output).toMatchObject({
      items: [...models]
        .reverse()
        .map(item => item.toJSON()),
      current_page: 1,
      per_page: 15,
      last_page: 1,
      total: 2
    })
  })

  it('should returns outpu using sort and filter', async () => {
    const faker = Category.fake().aCategory()
    const models = [
      faker.withName('a').build(),
      faker.withName('AAA').build(),
      faker.withName('AaA').build(),
      faker.withName('b').build(),
      faker.withName('c').build(),
    ]

    repository.bulkInsert(models)


    let output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', filter: 'a' })
    expect(output).toMatchObject({
      items: [models[1], models[2]]
        .map(item => item.toJSON()),
      current_page: 1,
      per_page: 2,
      last_page: 2,
      total: 3
    })

    output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', filter: 'a' })
    expect(output).toMatchObject({
      items: [models[0]]
        .map(item => item.toJSON()),
      current_page: 2,
      per_page: 2,
      last_page: 2,
      total: 3
    })

    output = await useCase.execute({ page: 1, per_page: 2, sort_dir: 'desc', sort: 'name', filter: 'a' })
    expect(output).toMatchObject({
      items: [models[0], models[2]]
        .map(item => item.toJSON()),
      current_page: 1,
      per_page: 2,
      last_page: 2,
      total: 3
    })
  })
})