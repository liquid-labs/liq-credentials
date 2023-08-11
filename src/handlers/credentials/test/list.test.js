/* global afterAll beforeAll describe expect jest test */
import * as fsPath from 'path'

import request from 'supertest'

import { appInit, initModel, Reporter } from '@liquid-labs/liq-core'
import { playgroundSimplePath } from '@liquid-labs/liq-test-lib'
import { tryExec } from '@liquid-labs/shell-toolkit'

const logs = []
const testOptions = {
  skipCorePlugins     : true,
  LIQ_PLAYGROUND_PATH : playgroundSimplePath,
  reporter            : new Reporter({ silent : true })
}

testOptions.reporter.log = jest.fn((msg) => { logs.push(msg) })
testOptions.reporter.error = testOptions.reporter.log
testOptions.logs = logs

const testCredsDB = fsPath.join(__dirname, 'data', 'creds-db.yaml')

describe('GET:/credentials/list', () => {
  let app, cache, model

  beforeAll(async() => {
    const pkgRoot = fsPath.resolve(__dirname, '..', '..', '..', '..')
    // liq-projects defines the GitHub credentials
    const liqProjectsRoot = tryExec('npm explore @liquid-labs/liq-projects -- pwd').stdout.trim()

    process.env.LIQ_PLAYGROUND = playgroundSimplePath
    process.env.LIQ_CREDENTIALS_DB_PATH = testCredsDB
    model = initModel(testOptions);
    ({ app, cache } = await appInit(Object.assign(
      { model },
      testOptions,
      { pluginDirs : [pkgRoot, liqProjectsRoot], noAPIUpdate : true }
    )))
  })
  afterAll(async() => { // put the original staff.json back in place
    cache.release()
  })

  test('lists in JSON format', async() => {
    const { body, headers, status } = await request(app)
      .get('/credentials/list')
      .accept('application/json')

    expect(status).toBe(200)
    expect(headers['content-type']).toMatch(/application\/json/)
    expect(body).toHaveLength(2)
  })
})
