type SequelizeModelFactoryProps = {
  model: any
  defaultFactoryProps: () => any
}

export class SequelizeModelFactory {
  constructor(private props: SequelizeModelFactoryProps){}

  async create(data?) {
    return this.props.model.create(data ? data : this.props.defaultFactoryProps())
  }

  make(data?) {
    return this.props.model.build(data ? data : this.props.defaultFactoryProps())
  }

  async bulkCreate() {

  }

  bulkMake() {

  }
}