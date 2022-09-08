import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize.model-factory";
import { validate as uuidValidate } from 'uuid'
import chance from 'chance'
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

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
    return new SequelizeModelFactory<StubModel, { id: string, name: string }>({
      model: StubModel,
      defaultFactoryProps: () => StubModel.mockFactory()
    })
  }
}

describe('SequelizeModelFactory Unit Tests', () => {
  setupSequelize({
    models: [StubModel]
  })

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

  test('make method', async () => {
    let model = StubModel.factory().make()
    expect(uuidValidate(model.id)).toBeTruthy()
    expect(model.id).not.toBeNull()
    expect(model.name).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    let modelFound = await StubModel.findByPk(model.id)
    expect(modelFound).toBeNull()

    model = StubModel.factory().make({
      id: '88ad5c34-b24c-4295-be98-2db7dc3699ee',
      name: 'test'
    })
    expect(model.id).toBe('88ad5c34-b24c-4295-be98-2db7dc3699ee')
    expect(model.name).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    modelFound = await StubModel.findByPk(model.id)
    expect(modelFound).toBeNull()
  })

  test('bulk create method using count = 1', async () => {
    let models = await StubModel.factory().bulkCreate()
    expect(models).toHaveLength(1)
    expect(models[0].id).not.toBeNull()
    expect(models[0].name).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    let modelFound = await StubModel.findByPk(models[0].id)
    expect(models[0].id).toBe(modelFound.id)
    expect(models[0].name).toBe(modelFound.name)

    models = await StubModel.factory().bulkCreate(() => ({
      id: '88ad5c34-b24c-4295-be98-2db7dc3699ee',
      name: 'test'
    }))
    expect(models[0].id).toBe('88ad5c34-b24c-4295-be98-2db7dc3699ee')
    expect(models[0].name).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    modelFound = await StubModel.findByPk(models[0].id)
    expect(models[0].id).toBe(modelFound.id)
    expect(models[0].name).toBe(modelFound.name)
  })

  test('bulk create method using count > 1', async () => {
    let models = await StubModel.factory().count(2).bulkCreate()
    expect(models).toHaveLength(2)
    expect(models[0].id).not.toBeNull()
    expect(models[0].name).not.toBeNull()
    expect(models[1].id).not.toBeNull()
    expect(models[1].name).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)

    let modelFound = await StubModel.findByPk(models[0].id)
    expect(models[0].id).toBe(modelFound.id)
    expect(models[0].name).toBe(modelFound.name)

    modelFound = await StubModel.findByPk(models[1].id)
    expect(models[1].id).toBe(modelFound.id)
    expect(models[1].name).toBe(modelFound.name)

    models = await StubModel.factory().count(2).bulkCreate(() => ({
      id: chance().guid({ version: 4 }),
      name: 'test'
    }))
    expect(models[0].id).not.toBe(models[1].id)
    expect(models[0].name).toBe('test')
    expect(models[1].id).not.toBe(models[0].id)
    expect(models[1].name).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)
  })

  test('bulk make method using count = 1', async () => {
    let models = StubModel.factory().bulkMake()
    expect(models).toHaveLength(1)
    expect(models[0].id).not.toBeNull()
    expect(models[0].name).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    let modelFound = await StubModel.findByPk(models[0].id)
    expect(modelFound).toBeNull()

    models = StubModel.factory().bulkMake(() => ({
      id: '88ad5c34-b24c-4295-be98-2db7dc3699ee',
      name: 'test'
    }))
    expect(models[0].id).toBe('88ad5c34-b24c-4295-be98-2db7dc3699ee')
    expect(models[0].name).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

    modelFound = await StubModel.findByPk(models[0].id)
    expect(modelFound).toBeNull()
  })

  test('bulk create method using count > 1', async () => {
    let models = StubModel.factory().count(2).bulkMake()
    expect(models).toHaveLength(2)
    expect(models[0].id).not.toBeNull()
    expect(models[0].name).not.toBeNull()
    expect(models[1].id).not.toBeNull()
    expect(models[1].name).not.toBeNull()
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)

    let modelFound = await StubModel.findByPk(models[0].id)
    expect(modelFound).toBeNull()

    modelFound = await StubModel.findByPk(models[1].id)
    expect(modelFound).toBeNull()

    models = StubModel.factory().count(2).bulkMake(() => ({
      id: chance().guid({ version: 4 }),
      name: 'test'
    }))
    expect(models[0].id).not.toBe(models[1].id)
    expect(models[0].name).toBe('test')
    expect(models[1].id).not.toBe(models[0].id)
    expect(models[1].name).toBe('test')
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)
  })
})