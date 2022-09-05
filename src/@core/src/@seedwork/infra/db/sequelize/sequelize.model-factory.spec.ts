import { Column, DataType, Model, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize.model-factory";
import { validate as uuidValidate } from 'uuid'
import chance from 'chance'

@Table({ tableName: 'Stub' })
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name;

  static mockFactory = jest.fn(() => ({
    id: chance().guid({ version: 4 }),
    name: chance().word(),
  }))

  static factory() {
    return new SequelizeModelFactory({
      model: StubModel,
      defaultFactoryProps: () => StubModel.mockFactory()
    })
  }
}

describe('SequelizeModelFactory Unit Tests', () => {
  let sequelize: Sequelize

  beforeAll(() => sequelize = new Sequelize({
    dialect: 'sqlite',
    host: ':memory:',
    logging: false,
    models: [StubModel]
  }));

  beforeEach(async () => { await sequelize.sync({ force: true }) })

  afterAll(async () => { await sequelize.close() })

  test('create method', async () => {
    let model = await StubModel.factory().create()
    expect(uuidValidate(model.id)).toBeTruthy()
    expect(model.name).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    let modelFound = await StubModel.findByPk(model.id)
    expect(model.id).toBe(modelFound.id)

    model = await StubModel.factory().create({
      id: '88ad5c34-b24c-4295-be98-2db7dc3699ee',
      name: 'test'
    })
    expect(model.id).toBe('88ad5c34-b24c-4295-be98-2db7dc3699ee')
    expect(model.name).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    modelFound = await StubModel.findByPk(model.id)
    expect(model.id).toBe(modelFound.id)
  })
})