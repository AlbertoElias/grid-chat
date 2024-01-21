import 'dotenv/config'
import 'reflect-metadata'

import { AppDataSource } from './src/db'
import { setUpServer } from './src/server'

AppDataSource.initialize()
  .then(async () => await setUpServer())
  .catch((error) => console.log(error))
