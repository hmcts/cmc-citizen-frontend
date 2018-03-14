import { InterestDateType } from 'app/common/interestDateType'
import { expect } from 'chai'
import { InterestType } from 'claim/form/models/interest'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'common/interestUtils'
import { MomentFactory } from 'common/momentFactory'
import * as claimStoreServiceMock from '../http-mocks/claim-store'

const sampleClaimObj = {
  claim: {
    interest: {
      type: InterestType.STANDARD
    },
    interestDate: {
      type: InterestDateType.SUBMISSION
    }
  },
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  responseDeadline: '2017-08-08'
}

describe('getInterestDetails', () => {

  it('should return undefined when interest has not been selected', async () => {
    const claim: Claim = new Claim().deserialize({
      ...sampleClaimObj,
      ...{
        claim: {
          interest: {
            type: InterestType.NO_INTEREST
          },
          interestDate: undefined
        }
      }
    })

    expect(await getInterestDetails(claim)).to.be.eq(undefined)
  })

  it('should return 0 for number of days when interest date starts from today', async () => {
    claimStoreServiceMock.mockCalculateInterestRate(5)

    const today = MomentFactory.currentDate()
    const claim: Claim = new Claim().deserialize({ ...sampleClaimObj, issuedOn: today })

    const { numberOfDays } = await getInterestDetails(claim) as any
    expect(numberOfDays).to.deep.eq(0)
  })

  it('should return 1 for number of days when interest date starts from yesterday', async () => {
    claimStoreServiceMock.mockCalculateInterestRate(5)

    const yesterday = MomentFactory.currentDate().subtract(1, 'days')
    const claim: Claim = new Claim().deserialize({ ...sampleClaimObj, issuedOn: yesterday })

    const { numberOfDays } = await getInterestDetails(claim) as any
    expect(numberOfDays).to.deep.eq(1)
  })

  it('should return 0 for number of days when interest date starts from tomorrow (issue date in the future)', async () => {
    claimStoreServiceMock.mockCalculateInterestRate(5)

    const tomorrow = MomentFactory.currentDate().add(1, 'days')
    const claim: Claim = new Claim().deserialize({ ...sampleClaimObj, issuedOn: tomorrow })

    const { numberOfDays } = await getInterestDetails(claim) as any
    expect(numberOfDays).to.deep.eq(0)
  })
})
