import { Category } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category-model";
import { CategorySequelizeRepository } from "../category-repository";

describe('CategorySequelizeRepository Unit Tests', () => {
  setupSequelize({ models: [CategoryModel] })
  let repository: CategorySequelizeRepository

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel)
  })

  it('should inserts a new entity', async () => {
    let category = new Category({ name: 'Movie' })
    await repository.insert(category)

    let model = await CategoryModel.findByPk(category.id)
    expect(model.toJSON()).toStrictEqual(category.toJSON())

    category = new Category({ name: 'Movie', description: 'some description', is_active: false })
    await repository.insert(category)

    model = await CategoryModel.findByPk(category.id)
    expect(model.toJSON()).toStrictEqual(category.toJSON())
  })

  it('should errors when find entity by id', async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake id`)
    )

    const id = new UniqueEntityId()
    await expect(repository.findById(id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${id}`)
    )
  })

  it('should find a entity by id', async () => {
    const entity = new Category({ name: 'Movie' })
    await repository.insert(entity)

    let entityFound = await repository.findById(entity.id)
    expect(entityFound.toJSON()).toStrictEqual(entityFound.toJSON())

    entityFound = await repository.findById(entity.uniqueEntityId)
    expect(entityFound.toJSON()).toStrictEqual(entityFound.toJSON())
  })

  it('should return all categories', async () => {
    const entity = new Category({ name: 'Movie' })
    await repository.insert(entity)
    const entities = await repository.findAll()
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
  })

  it('search', async () => {
    await CategoryModel.factory().create()
    console.log(await CategoryModel.findAll())
  })
})