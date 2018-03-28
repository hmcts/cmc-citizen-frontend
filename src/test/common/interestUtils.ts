import { InterestDateType } from 'app/common/interestDateType'
import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'common/interestUtils'
import { MomentFactory } from 'common/momentFactory'
import * as claimStoreServiceMock from '../http-mocks/claim-store'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { Interest } from 'claims/models/interest'
import { InterestDate } from 'claims/models/interestDate'
import { InterestType as ClaimInterestType } from 'claims/models/interestType'

const sampleClaimObj = {
  claim: {
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case'
    } as Interest,
    interestDate: {
      type: InterestDateType.SUBMISSION,
      endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
    } as InterestDate
  },
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  responseDeadline: '2017-08-08',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc'
}

describe('getInterestDetails', () => {

  it('should return undefined when interest has not been selected', async () => {
    const claim: Claim = new Claim().deserialize({
      ...sampleClaimObj,
      ...{
        claim: {
          interest: undefined,
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
