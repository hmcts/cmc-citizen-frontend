import { expect } from 'chai'
import { getInterestDetails } from 'common/interest'
import * as claimStoreServiceMock from '../../http-mocks/claim-store'
import { Claim } from 'claims/models/claim'
import { InterestType } from 'claim/form/models/interest'
import { MomentFactory } from 'common/momentFactory'
import { Moment } from 'moment'

const sampleClaimObj = {
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  claim: {
  },
  responseDeadline: '2017-08-08'
}

describe('getInterestDetails', () => {

  it('should return undefined when interest has not been selected', async () => {
    const claim: Claim = new Claim().deserialize(sampleClaimObj)
    claim.claimData.interest.type = InterestType.NO_INTEREST
    expect(await getInterestDetails(claim)).to.be.eq(undefined)
  })

  it('should return 1 for number of days when interest date starts from today', async () => {
    const claim: Claim = new Claim().deserialize(sampleClaimObj)
    claimStoreServiceMock.mockCalculateInterestRate(5)
    const interestData = {
      numberOfDays: 1,
      interest: 5,
      rate: claim.claimData.interest.rate,
      interestDate: MomentFactory.currentDate()
    }
    expect(await getInterestDetails(claim)).to.deep.eq(interestData)
  })

  it('should return 2 for number of days when interest date starts from yesterday', async () => {
    const claim: Claim = new Claim().deserialize(sampleClaimObj)
    const yesterday: Moment = MomentFactory.currentDate().subtract(1, 'days')
    claimStoreServiceMock.mockCalculateInterestRate(5)
    claim.createdAt = yesterday
    const interestData = {
      numberOfDays: 2,
      interest: 5,
      rate: claim.claimData.interest.rate,
      interestDate: yesterday
    }
    expect(await getInterestDetails(claim)).to.deep.eq(interestData)
  })
})
