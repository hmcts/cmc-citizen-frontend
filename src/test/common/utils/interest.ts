import { expect } from 'chai'
import { getInterestDetails } from 'common/interest'
import * as claimStoreServiceMock from '../../http-mocks/claim-store'
import { Claim } from 'claims/models/claim'
import { InterestType } from 'claim/form/models/interest'
import { MomentFactory } from 'common/momentFactory'
import { Moment } from 'moment'

const sampleClaimObj = {
  id: 1,
  submitterId: '1',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  defendantId: '123',
  referenceNumber: '000MC000',
  createdAt: MomentFactory.currentDate(),
  issuedOn: MomentFactory.currentDate(),
  totalAmountTillToday: 200,
  totalAmountTillDateOfIssue: 200,
  claim: {
    claimants: [
      {
        type: 'individual',
        name: 'John Smith',
        address: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          postcode: 'bb127nq'
        },
        dateOfBirth: '1990-02-17'
      }
    ],
    defendants: [
      {
        type: 'individual',
        name: 'John Doe',
        address: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          postcode: 'bb127nq'
        }
      }
    ],
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    },
    amount: {
      type: 'breakdown',
      rows: [{ reason: 'Reason', amount: 200 }]
    },
    interestDate: {
      date: {
        year: 2000,
        month: 2,
        day: 1
      }
    },
    interest: {
      type: InterestType.STANDARD
    },
    reason: 'Because I can'
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
