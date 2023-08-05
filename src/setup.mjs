import { CRED_TYPES } from '@liquid-labs/liq-credentials-db'

const setup = async({ app, model }) => {
  setupPathResolvers({ app, model })
}

const setupPathResolvers = ({ app, model }) => {
  app.ext.pathResolvers.credential = {
    bitReString    : '(?:' + CRED_TYPES.join('|') + ')',
    optionsFetcher : ({ currToken = '' }) => {
      const results = []
      if (currToken) {
        for (const credName of CRED_TYPES) {
          if (credName.startsWith(currToken)) {
            results.push(credName)
          }
        }
      }
      else {
        results.push(...CRED_TYPES)
      }

      return results
    }
  }
}

export { setup }
