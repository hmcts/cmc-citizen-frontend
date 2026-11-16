import { expect } from 'chai'
import { globalAgent } from 'http'

describe('HTTP test isolation', () => {
  it('should disable connection reuse in the process executing the tests', () => {
    expect(globalAgent.options.keepAlive).to.equal(false)
  })
})
