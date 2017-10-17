import { expect } from 'chai'
import * as express from 'express'
import * as mock from 'nock'

import * as idamServiceMock from '../http-mocks/idam'

export function attachDefaultHooks (app?: express.Express) {
  let retrieveServiceTokenMock: any

  before(() => {
    if (app) {
      app.locals.csrf = 'dummy-token'
    }
  })

  beforeEach(() => {
    mock.cleanAll()

    retrieveServiceTokenMock = idamServiceMock.resolveRetrieveServiceToken()
  })

  afterEach(() => {
    const pendingMocks = (mock.pendingMocks() as any).filter(item => item !== retrieveServiceTokenMock.interceptors[0]._key)
    expect(pendingMocks, 'At least one mock were declared but not used').to.be.deep.equal([])
  })
}
