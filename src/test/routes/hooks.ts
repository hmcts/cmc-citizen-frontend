import { expect } from 'chai'
import * as mock from 'nock'

export function attachDefaultHooks () {
  beforeEach(() => {
    mock.cleanAll()
  })

  afterEach(() => {
    expect(mock.pendingMocks(), 'At least one mock were declared but not used').to.be.deep.equal([])
  })
}
