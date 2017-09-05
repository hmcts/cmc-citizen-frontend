import { expect } from 'chai'

import { ClaimModelConverter } from 'app/claims/claimModelConverter'

import DraftClaim from 'drafts/models/draftClaim'
import { claimDraft as draftTemplate } from '../../data/draft/claimDraft'
import {
  companyDetails,
  individualDetails,
  organisationDetails,
  soleTraderDetails
} from '../../data/draft/partyDetails'

import ClaimData from 'app/claims/models/claimData'
import { claimData as entityTemplate } from '../../data/entity/claimData'
import { company, individual, organisation, soleTrader } from '../../data/entity/party'

function prepareClaimDraft (claimantPartyDetails: object, defendantPartyDetails: object): DraftClaim {
  return new DraftClaim().deserialize({
    ...draftTemplate,
    claimant: { ...draftTemplate.claimant, partyDetails: claimantPartyDetails },
    defendant: { ...draftTemplate.defendant, partyDetails: defendantPartyDetails }
  })
}

function prepareClaimData (claimantParty: object, defendantParty: object): ClaimData {
  return new ClaimData().deserialize({
    ...entityTemplate,
    claimant: { ...claimantParty, email: undefined, mobilePhone: '07000000000' },
    defendants: [{ ...defendantParty, email: 'defendant@example.com' }]
  })
}

describe('ClaimModelConverter', () => {
  [
    [[individualDetails, individual], [soleTraderDetails, soleTrader]],
    [[soleTraderDetails, soleTrader], [companyDetails, company]],
    [[companyDetails, company], [organisationDetails, organisation]],
    [[organisationDetails, organisation], [individualDetails, individual]]
  ].forEach(entry => {
    const [[claimantPartyDetails, claimantParty], [defendantPartyDetails, defendantParty]] = entry

    it(`should convert claim issued by ${claimantParty.type} against ${defendantParty.type}`, () => {
      const claimDraft = prepareClaimDraft(claimantPartyDetails, defendantPartyDetails)
      const claimData = prepareClaimData(claimantParty, defendantParty)

      expect(ClaimModelConverter.convert(claimDraft)).to.deep.equal(claimData)
    })
  })
})
