import { config as readEnv } from 'dotenv'
import { join } from 'path'

type Config = {
  db: {
    vendor: any,
    host: string,
    logging: boolean
  }
}

function makeConfig(envFile): Config {
  const output = readEnv({ path: envFile })

  return {
    db: {
      vendor: output.parsed.DB_VENDOR as any,
      host: output.parsed.DB_HOST,
      logging: output.parsed.DB_LOGGING === 'true',
    },
  }
}

/**
 * This is a config test, but, we can make many configs to our application. 
 * Example:
 * Local config
 * Development config
 * Production config
 */

const envTestingFile = join(__dirname, '../../../../.env.test')
export const configTest = makeConfig(envTestingFile)


//export const config = makeConfig(envTestingFile)