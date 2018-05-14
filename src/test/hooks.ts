import { expect } from 'chai'
import * as mock from 'nock'

import * as idamServiceMock from 'test/http-mocks/idam'

export function attachDefaultHooks () {
  let retrieveServiceTokenMock: any

  beforeEach(() => {
    mock.cleanAll()

    retrieveServiceTokenMock = idamServiceMock.resolveRetrieveServiceToken()
  })

  afterEach(() => {
    const pendingMocks = (mock.pendingMocks() as any).filter(item => item !== retrieveServiceTokenMock.interceptors[0]._key)
    expect(pendingMocks, 'At least one mock were declared but not used').to.be.deep.equal([])
  })
}
