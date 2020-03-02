import { InterestType as ClaimInterestType } from 'claims/models/interestType'
import { MadeBy } from 'claims/models/madeBy'
import { PartyType } from 'integration-test/data/party-type'
import { Interest } from 'claims/models/interest'
import { InterestDateType } from 'common/interestDateType'
import * as SampleParty from 'test/data/entity/party'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDate } from 'claims/models/interestDate'

export function getPartyForType (type: PartyType): any {
  switch (type) {
    case PartyType.SOLE_TRADER:
      return SampleParty.soleTrader
    case PartyType.INDIVIDUAL:
      return SampleParty.individual
    case PartyType.ORGANISATION:
      return SampleParty.organisation
    case PartyType.COMPANY:
      return SampleParty.company
  }
}

export function createClaim (claimant: PartyType, defendant: PartyType, currentParty: MadeBy = MadeBy.CLAIMANT): any {
  return {
    ...claimStoreServiceMock.sampleClaimIssueCommonObj,
    features: ['directionsQuestionnaire'],
    response: currentParty === MadeBy.CLAIMANT ? claimStoreServiceMock.sampleDefendantResponseObj.response : undefined,
    claim: {
      claimants: [
        {
          ...getPartyForType(claimant)
        }
      ],
      defendants: [
        {
          ...getPartyForType(defendant)
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
      interest: {
        type: ClaimInterestType.STANDARD,
        rate: 10,
        reason: 'Special case',
        interestDate: {
          type: InterestDateType.SUBMISSION,
          endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
        } as InterestDate
      } as Interest,
      reason: 'Because I can',
      feeAmountInPennies: 2500,
      timeline: { rows: [{ date: 'a', description: 'b' }] }
    }
  }
}
