import * as fs from 'node:fs/promises'
import * as fsPath from 'node:path'

import { CredentialsDB, CREDS_PATH_STEM } from '@liquid-labs/liq-credentials-db'

const setup = async({ app, cache, serverConfigRoot }) => {
  const credsDir = fsPath.join(serverConfigRoot, CREDS_PATH_STEM)
  await fs.mkdir(credsDir, { recursive : true })

  const credentialsDB = new CredentialsDB({ app, cache, serverConfigRoot })
  app.ext.credentialsDB = credentialsDB

  setupPathResolvers({ app })
}

const setupPathResolvers = ({ app }) => {
  app.ext.pathResolvers.credential = {
    bitReString    : '(?:[A-Z0-9][A-Z0-9_]*)',
    optionsFetcher : () => app.ext.credentialsDB.listSupported().map(({ key }) => key)
  }
}

export { setup }
