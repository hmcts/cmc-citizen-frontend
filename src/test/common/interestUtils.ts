import { InterestDateType } from 'app/common/interestDateType'
import { expect } from 'chai'
import { InterestRate, InterestRateOption } from 'claim/form/models/interestRate'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'common/interestUtils'
import { MomentFactory } from 'common/momentFactory'
import * as claimStoreServiceMock from '../http-mocks/claim-store'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { InterestOption } from 'claim/form/models/interest'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDate } from 'claim/form/models/interestDate'
import { InterestStartDate } from 'claim/form/models/interestStartDate'

const sampleClaimObj = {
  claim: {
    interest: {
      option: InterestOption.YES
    },
    interestType: {
      option: InterestTypeOption.SAME_RATE
    } as InterestType,
    interestRate: {
      type: InterestRateOption.DIFFERENT,
      rate: 10,
      reason: 'Special case'
    } as InterestRate,
    interestDate: {
      type: InterestDateType.SUBMISSION
    } as InterestDate,
    interestStartDate: {
      date: {
        day: 10,
        month: 12,
        year: 2016
      },
      reason: 'reason'
    } as InterestStartDate,
    interestEndDate: {
      option: InterestEndDateOption.SETTLED_OR_JUDGMENT
    } as InterestEndDate
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
            option: InterestOption.NO
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
