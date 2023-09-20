import { CredentialsDB } from '@liquid-labs/liq-credentials-db'

const setup = async({ app, cache, model }) => {
  const credentialsDB = new CredentialsDB({ cache })
  app.ext.credentialsDB = credentialsDB

  setupPathResolvers({ app, model })
}

const setupPathResolvers = ({ app, model }) => {
  app.ext.pathResolvers.credential = {
    bitReString    : '(?:[A-Z0-9_])',
    optionsFetcher : () => app.ext.credentialsDB.listSupported().map(({ key }) => key)
  }
}

export { setup }
