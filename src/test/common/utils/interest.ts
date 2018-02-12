import { expect } from 'chai'
import { getInterestDetails } from 'common/interest'
import * as claimStoreServiceMock from '../../http-mocks/claim-store'
import { Claim } from 'claims/models/claim'
import { InterestType } from 'claim/form/models/interest'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'

describe('getInterestDetails', () => {

  it('should return undefined when interest has not been selected', async () => {
    let claim: Claim = new Claim().deserialize(claimStoreServiceMock.sampleClaimObj)
    claim.claimData.interest.type = InterestType.NO_INTEREST
    expect(await getInterestDetails(claim)).to.be.eq(undefined)
  })

  it('should return an object containing the needed values to be displayed', async () => {
    const claim: Claim = new Claim().deserialize(claimStoreServiceMock.sampleClaimObj)
    claimStoreServiceMock.mockCalculateInterestRate(0)
    const createdDate: Moment = claim.createdAt
    const interestData = {
      numberOfDays: MomentFactory.currentDate().diff(createdDate, 'days') + 1,
      interest: 0,
      rate: claim.claimData.interest.rate,
      interestDate: createdDate
    }
    expect(await getInterestDetails(claim)).to.deep.eq(interestData)
  })
})
