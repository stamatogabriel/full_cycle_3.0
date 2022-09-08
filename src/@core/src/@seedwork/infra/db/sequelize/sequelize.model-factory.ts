import { Model } from "sequelize-typescript";

type SequelizeModelFactoryProps<ModelProps = any> = {
  model: any
  defaultFactoryProps: () => ModelProps
}

export class SequelizeModelFactory<ModelClass extends Model, ModelProps = any> {
  private _count = 1;

  constructor(private props: SequelizeModelFactoryProps) {}

  count(count: number) {
    this._count = count
    return this
  }

  async create(data?: ModelProps): Promise<ModelClass> {
    return this.props.model.create(data ? data : this.props.defaultFactoryProps())
  }

  make(data?: ModelProps): ModelClass {
    return this.props.model.build(data ? data : this.props.defaultFactoryProps())
  }

  async bulkCreate(factoryProps?: (index: number) => ModelProps): Promise<ModelClass[]> {
    const data = new Array(this._count)
      .fill(factoryProps ? factoryProps : this.props.defaultFactoryProps)
      .map((factory, index) => factory(index))
    return this.props.model.bulkCreate(data)
  }

  bulkMake(factoryProps?: (index: number) => ModelProps): ModelClass[] {
    const data = new Array(this._count)
      .fill(factoryProps ? factoryProps : this.props.defaultFactoryProps)
      .map((factory, index) => factory(index))
    return this.props.model.bulkBuild(data)
  }
}