import { Category, CategoryRepositoryContract } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import _chance from 'chance'
import { CategorySequelize } from "../category-sequelize";

let chance: Chance.Chance;
chance = _chance()
describe('CategorySequelizeRepository Unit Tests', () => {
  setupSequelize({ models: [CategorySequelize.CategoryModel] })
  let repository: CategorySequelize.CategoryRepository

  beforeEach(async () => {
    repository = new CategorySequelize.CategoryRepository(CategorySequelize.CategoryModel)
  })

  it('should inserts a new entity', async () => {
    let category = new Category({ name: 'Movie' })
    await repository.insert(category)

    let model = await CategorySequelize.CategoryModel.findByPk(category.id)
    expect(model.toJSON()).toStrictEqual(category.toJSON())

    category = new Category({ name: 'Movie', description: 'some description', is_active: false })
    await repository.insert(category)

    model = await CategorySequelize.CategoryModel.findByPk(category.id)
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

  it('should trhow error when a entity not found', async () => {
    const entity = new Category({ name: 'Movie' })
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID ${entity.id}`
      )
    )
  })

  it('should update a entity', async () => {
    const entity = new Category({ name: 'Movie' })
    await repository.insert(entity)

    entity.update({name: "Movie Updated", description: entity.description})
    await repository.update(entity)

    let entityFound = await repository.findById(entity.id)
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON())
  })

  it('should trhow error on delete when a entity not found', async () => {
    const entity = new Category({ name: 'Movie' })
    await expect(repository.delete('fake id')).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID ${'fake id'}`
      )
    )

    await expect(repository.delete(new UniqueEntityId('88ad5c34-b24c-4295-be98-2db7dc3699ee'))).rejects.toThrow(
      new NotFoundError(
        `Entity not found using ID ${'88ad5c34-b24c-4295-be98-2db7dc3699ee'}`
      )
    )
  })

  it('should delete a entity', async () => {
    const entity = new Category({ name: 'Movie' })
    await repository.insert(entity)

    await repository.delete(entity.id)
    let entityFound = await CategorySequelize.CategoryModel.findByPk(entity.id)
    expect(entityFound).toBeNull()
  })

  describe('search method tests', () => {
    it('shoul only apply paginate when order params are null', async () => {
      const created_at = new Date()

      await CategorySequelize.CategoryModel.factory().count(16).bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: 'Movie',
        description: null,
        is_active: true,
        created_at
      }))

      const spyToEntity = jest.spyOn(CategorySequelize.CategoryModelMapper, 'toEntity')

      const searchOutput = await repository.search(new CategoryRepositoryContract.SearchParams())

      expect(searchOutput).toBeInstanceOf(CategoryRepositoryContract.SearchResult)
      expect(spyToEntity).toHaveBeenCalledTimes(15)
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null,
        last_page: 2,
      })

      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(Category)
        expect(item.id).toBeDefined()
      })

      const items = searchOutput.items.map(item => item.toJSON())
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          is_active: true,
          created_at
        })
      )
    })

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date()
      await CategorySequelize.CategoryModel.factory().count(16).bulkCreate((index) => ({
        id: chance.guid({ version: 4 }),
        name: `Movie${index}`,
        description: null,
        is_active: true,
        created_at: new Date(created_at.getTime() + 100 + index)
      }))

      const searchOutput = await repository.search(new CategoryRepositoryContract.SearchParams())
      searchOutput.items.reverse().forEach((item, index) => {
        expect(`${item.name}${index + 1}`)
      })
    })

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'created_at'])
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      }
      const categoriesProp = [
        { id: chance.guid({ version: 4 }), name: 'test', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TEST', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TeSt', ...defaultProps },
      ]
      const categories = await CategorySequelize.CategoryModel.bulkCreate(categoriesProp)

      let result = await repository.search(
        new CategoryRepositoryContract.SearchParams({
          page: 1,
          per_page: 2,
          filter: "TEST"
        }))

      expect(result.toJSON(true)).toMatchObject(new CategoryRepositoryContract.SearchResult({
        items: [
          CategorySequelize.CategoryModelMapper.toEntity(categories[0]),
          CategorySequelize.CategoryModelMapper.toEntity(categories[2])
        ],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        filter: 'TEST',
        sort_dir: null
      }).toJSON(true))

      result = await repository.search(
        new CategoryRepositoryContract.SearchParams({
          page: 2,
          per_page: 2,
          filter: 'TEST'
        }))

      expect(result.toJSON(true)).toMatchObject(new CategoryRepositoryContract.SearchResult({
        items: [CategorySequelize.CategoryModelMapper.toEntity(categories[3])],
        total: 3,
        current_page: 2,
        per_page: 2,
        sort: null,
        filter: 'TEST',
        sort_dir: null
      }).toJSON(true))
    })

    it('should apply filter, paginate and sort', async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      }
      const categoriesProp = [
        { id: chance.guid({ version: 4 }), name: 'b', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'd', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'e', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'c', ...defaultProps },
      ]

      const categories = await CategorySequelize.CategoryModel.bulkCreate(categoriesProp)

      const arrange = [
        {
          params: new CategoryRepositoryContract.SearchParams({ page: 1, per_page: 2, sort: 'name' }),
          result: new CategoryRepositoryContract.SearchResult({
            items: [
              CategorySequelize.CategoryModelMapper.toEntity(categories[1]),
              CategorySequelize.CategoryModelMapper.toEntity(categories[0])
            ],
            total: 5,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            filter: null,
            sort_dir: 'asc'
          })
        },
        {
          params: new CategoryRepositoryContract.SearchParams({ page: 2, per_page: 2, sort: 'name' }),
          result: new CategoryRepositoryContract.SearchResult({
            items: [
              CategorySequelize.CategoryModelMapper.toEntity(categories[4]),
              CategorySequelize.CategoryModelMapper.toEntity(categories[2])
            ],
            total: 5,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            filter: null,
            sort_dir: 'asc'
          })
        },
      ]

      for (const item of arrange) {
        let result = await repository.search(item.params)
        expect(result.toJSON(true)).toMatchObject(item.result.toJSON(true))
      }

    })

    describe('should apply filter, paginate and sort', () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date()
      }
      const categoriesProp = [
        { id: chance.guid({ version: 4 }), name: 'teste', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'a', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'TESTE', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'c', ...defaultProps },
        { id: chance.guid({ version: 4 }), name: 'teSte', ...defaultProps },
      ]

      let categories: any
      let arrange = [
        {
          params: new CategoryRepositoryContract.SearchParams({ page: 1, per_page: 2, sort: 'name', filter: 'teste' }),
          result: new CategoryRepositoryContract.SearchResult({
            items: [new Category(categoriesProp[2]), new Category(categoriesProp[4])],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'teste',
            sort_dir: 'asc'
          })
        },
        {
          params: new CategoryRepositoryContract.SearchParams({ page: 2, per_page: 2, sort: 'name', filter: 'teste' }),
          result: new CategoryRepositoryContract.SearchResult({
            items: [new Category(categoriesProp[0])],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'teste',
            sort_dir: 'asc'
          })
        },
      ]

      beforeEach(async () => {
        categories = await CategorySequelize.CategoryModel.bulkCreate(categoriesProp)
      })

      test.each(arrange)('when value is %o', async item => {
        let result = await repository.search(item.params)
        expect(result.toJSON(true)).toMatchObject(item.result.toJSON(true))
      })
    })
  })
})