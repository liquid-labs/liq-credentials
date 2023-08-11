const setup = async({ app, model }) => {
  setupPathResolvers({ app, model })
}

const setupPathResolvers = ({ app, model }) => {
  app.ext.pathResolvers.credential = {
    bitReString    : '(?:[A-Z0-9_])',
    optionsFetcher : () => app.ext.credentialsDB.listSupported().map(({ key }) => key)
  }
}

export { setup }
