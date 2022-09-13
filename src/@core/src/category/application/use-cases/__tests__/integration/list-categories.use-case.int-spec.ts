import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { ListCategoriesUseCase } from "../../list-categories.use-case";
import _chance from 'chance'

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

  it('should resturn output using empty input with categories ordered by created_at', async () => {
    const models = await CategoryModel.factory().count(2).bulkCreate((index: number) => ({
      id: chance.guid({ version: 4 }),
      name: `Category ${index}`,
      description: 'some description',
      is_active: true,
      created_at: new Date(new Date().getTime() + index)
    }))

    const output = await useCase.execute({})
    expect(output).toMatchObject({
      items: [...models]
        .reverse()
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map(item => item.toJSON()),
      current_page: 1,
      per_page: 15,
      last_page: 1,
      total: 2
    })
  })

  it('should returns outpu using sort and filter', async () => {
    const models = await CategoryModel.factory().count(5).bulkMake()

    models[0].name = 'a'
    models[1].name = 'AAA'
    models[2].name = 'AaA'
    models[3].name = 'b'
    models[4].name = 'c'

    CategoryModel.bulkCreate(models.map(m => m.toJSON()))


    let output = await useCase.execute({ page: 1, per_page: 2, sort: 'name', filter: 'a' })
    expect(output).toMatchObject({
      items: [models[1], models[2]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map(item => item.toJSON()),
      current_page: 1,
      per_page: 2,
      last_page: 2,
      total: 3
    })

    output = await useCase.execute({ page: 2, per_page: 2, sort: 'name', filter: 'a' })
    expect(output).toMatchObject({
      items: [models[0]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map(item => item.toJSON()),
      current_page: 2,
      per_page: 2,
      last_page: 2,
      total: 3
    })

    output = await useCase.execute({ page: 1, per_page: 2, sort_dir: 'desc', sort: 'name', filter: 'a' })
    expect(output).toMatchObject({
      items: [models[0], models[2]]
        .map(CategorySequelize.CategoryModelMapper.toEntity)
        .map(item => item.toJSON()),
      current_page: 1,
      per_page: 2,
      last_page: 2,
      total: 3
    })
  })
})