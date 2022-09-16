import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { configTest as config } from "#seedwork/infra/config";

const sequelizeOptions: SequelizeOptions = {
  dialect: config.db.vendor,
  host: config.db.host,
  logging: config.db.logging,
}

export function setupSequelize(options: SequelizeOptions) {
  let _sequelize: Sequelize

  beforeAll(() => _sequelize = new Sequelize({ ...options, ...sequelizeOptions }));

  beforeEach(async () => { await _sequelize.sync({ force: true }) })

  afterAll(async () => { await _sequelize.close() })

  return {
    get sequelize() {
      return _sequelize
    }
  }
}

/** We can create a helper function to make a custom db config */
// function makeSequelizeOptions(config: Config) {}