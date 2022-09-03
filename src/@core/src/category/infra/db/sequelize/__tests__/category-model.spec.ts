import { DataType, Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category-model";

describe('CategoryModel Unit Tests', () => {
  let sequelize: Sequelize

  beforeAll(() => sequelize = new Sequelize({
    dialect: 'sqlite',
    host: ':memory:',
    logging: false,
    models: [CategoryModel]
  }));

  beforeEach(async () => { await sequelize.sync({ force: true }) })

  afterAll(async () => { await sequelize.close() })

  test('mapping props', () => {
    const attributes = Object.keys(CategoryModel.getAttributes())
    const attributesMap = CategoryModel.getAttributes()

    expect(attributes).toStrictEqual(['id', 'name', 'description', 'is_active', 'created_at'])

    const idAttr = attributesMap.id
    expect(idAttr).toMatchObject({
      field: 'id',
      fieldName: 'id',
      primaryKey: true,
      type: DataType.UUID()
    })

    const nameAttr = attributesMap.name
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255)
    })

    const descriptionAttr = attributesMap.description
    expect(descriptionAttr).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT()
    })

    const isActiveAttr = attributesMap.is_active
    expect(isActiveAttr).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN()
    })

    const createdAtAttr = attributesMap.created_at
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE()
    })
  })

  it('create', async () => {
    const arrange = {
      id: '88ad5c34-b24c-4295-be98-2db7dc3699ee',
      name: 'Movie',
      is_active: true,
      created_at: new Date()
    }

    const category = await CategoryModel.create(arrange)
    expect(category.toJSON()).toStrictEqual(arrange)
  })
})