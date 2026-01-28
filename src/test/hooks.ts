import { expect } from 'chai'
import * as mock from 'nock'
import * as idamServiceMock from 'test/http-mocks/idam'

export function attachDefaultHooks () {
  let retrieveServiceTokenMock: any

  beforeEach(() => {
    retrieveServiceTokenMock = idamServiceMock.resetAuthMocks()
  })

  afterEach(() => {
    const pendingMocks = (mock.pendingMocks() as any).filter(item => {
      if (item === retrieveServiceTokenMock.interceptors[0]._key) return true
      if (typeof item === 'string' && /\/o\/userinfo/.test(item)) return true
      return false
    })
    const stillPending = (mock.pendingMocks() as any).filter((item: string) => {
      if (item === retrieveServiceTokenMock.interceptors[0]._key) return false
      if (typeof item === 'string' && /\/o\/userinfo/.test(item)) return false
      return true
    })
    expect(stillPending, 'At least one mock were declared but not used').to.be.deep.equal([])
  })
}
