import { expect } from 'chai'
import { dashboardFilterForClaimant, dashboardFilterForDefendant } from 'dashboard/filters/claimStatusFilter'
import { Claim } from 'main/app/claims/models/claim'
import { sampleClaimObj } from 'test/http-mocks/claim-store'

describe('The dashboard status filter', () => {
  const claim = new Claim().deserialize(sampleClaimObj)

  it('should be applied when the dashboard status template exists', () => {
    expect(dashboardFilterForClaimant(claim)).to.be.an('object')
    expect(dashboardFilterForDefendant(claim)).to.be.an('object')
  })

  it('should return empty string if the template is not found', () => {
    expect(dashboardFilterForClaimant(undefined)).to.equal('')
    expect(dashboardFilterForDefendant(undefined)).to.equal('')
  })
})
