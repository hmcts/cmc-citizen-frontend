import { expect } from 'chai'
import * as sinon from 'sinon'
import * as healthcheck from '@hmcts/nodejs-healthcheck'
import { hmctsAccessHealthCheck, hmctsAccessCheck } from 'routes/health'

describe('HMCTS Access health check (hmcts-access-migration gated)', () => {
  it('should report UP without running the probe when the flag is off', async () => {
    const probe = { call: sinon.spy() }
    const toggles = { isHmctsAccessMigrationEnabled: () => Promise.resolve(false) }

    const result = await hmctsAccessHealthCheck(toggles as any, probe as any)

    expect(probe.call.called).to.equal(false)
    expect(result).to.deep.equal(healthcheck.up())
  })

  it('should run the HMCTS Access probe when the flag is on', async () => {
    const probeResult = healthcheck.up()
    const probe = { call: sinon.stub().returns(probeResult) }
    const toggles = { isHmctsAccessMigrationEnabled: () => Promise.resolve(true) }

    const result = await hmctsAccessHealthCheck(toggles as any, probe as any)

    expect(probe.call.calledOnce).to.equal(true)
    expect(result).to.equal(probeResult)
  })

  it('should expose a raw check that reports UP when the flag is off (offline default)', async () => {
    const result = await hmctsAccessCheck.call()
    expect(result).to.deep.equal(healthcheck.up())
  })
})