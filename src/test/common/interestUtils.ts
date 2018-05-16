import { InterestDateType } from 'common/interestDateType'
import { expect } from 'chai'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'shared/interestUtils'
import { MomentFactory } from 'shared/momentFactory'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { Interest } from 'claims/models/interest'
import { InterestDate } from 'claims/models/interestDate'
import { InterestType as ClaimInterestType } from 'claims/models/interestType'

const sampleClaimObj = {
  claim: {
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case',
      interestDate: {
        type: InterestDateType.SUBMISSION,
        endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
      } as InterestDate
    } as Interest
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
          interest: undefined,
          interestDate: undefined
        }
      }
    })

    expect(await getInterestDetails(claim)).to.be.eq(undefined)
  })

  it('should return 0 for number of days when interest date starts from today', async () => {
    const today = MomentFactory.currentDate()
    const claim: Claim = new Claim().deserialize({ ...sampleClaimObj, issuedOn: today })

    const { numberOfDays } = await getInterestDetails(claim) as any
    expect(numberOfDays).to.deep.eq(0)
  })

  it('should return 1 for number of days when interest date starts from yesterday', async () => {
    const yesterday = MomentFactory.currentDate().subtract(1, 'days')
    const claim: Claim = new Claim().deserialize({ ...sampleClaimObj, issuedOn: yesterday })

    const { numberOfDays } = await getInterestDetails(claim) as any
    expect(numberOfDays).to.deep.eq(1)
  })

  it('should return 0 for number of days when interest date starts from tomorrow (issue date in the future)', async () => {
    const tomorrow = MomentFactory.currentDate().add(1, 'days')
    const claim: Claim = new Claim().deserialize({ ...sampleClaimObj, issuedOn: tomorrow })

    const { numberOfDays } = await getInterestDetails(claim) as any
    expect(numberOfDays).to.deep.eq(0)
  })
})
