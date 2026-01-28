import { expect } from 'chai'
import * as mock from 'nock'
import * as idamServiceMock from 'test/http-mocks/idam'

export function attachDefaultHooks () {
  let retrieveServiceTokenMock: any

  beforeEach(() => {
    retrieveServiceTokenMock = idamServiceMock.resetAuthMocks()
  })

  afterEach(() => {
    const scopeKey = retrieveServiceTokenMock?.interceptors?.[0]?._key
    if (scopeKey === undefined) {
      return
    }
    const stillPending = (mock.pendingMocks() as any).filter((item: string) => {
      if (item === scopeKey) return false
      if (typeof item === 'string' && /\/o\/userinfo/.test(item)) return false
      return true
    })
    expect(stillPending, 'At least one mock were declared but not used').to.be.deep.equal([])
  })
}
