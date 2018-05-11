import { expect } from 'chai'

import { ClaimModelConverter } from 'claims/claimModelConverter'

import { DraftClaim } from 'drafts/models/draftClaim'
import { claimDraft as draftTemplate } from 'test/data/draft/claimDraft'
import {
  companyDetails,
  individualDetails,
  organisationDetails,
  soleTraderDetails
} from 'test/data/draft/partyDetails'

import { ClaimData } from 'claims/models/claimData'
import { claimData as entityTemplate } from 'test/data/entity/claimData'
import { company, individual, organisation, soleTrader } from 'test/data/entity/party'

function prepareClaimDraft (claimantPartyDetails: object, defendantPartyDetails: object): DraftClaim {
  return new DraftClaim().deserialize({
    ...draftTemplate,
    claimant: { ...draftTemplate.claimant, partyDetails: claimantPartyDetails },
    defendant: {
      ...draftTemplate.defendant,
      partyDetails: { ...defendantPartyDetails, hasCorrespondenceAddress: false, correspondenceAddress: undefined }
    }
  })
}

function prepareClaimData (claimantParty: object, defendantParty: object): ClaimData {
  return new ClaimData().deserialize({
    ...entityTemplate,
    claimants: [{ ...claimantParty, email: undefined, mobilePhone: '07000000000' }],
    defendants: [{ ...defendantParty, email: 'defendant@example.com', dateOfBirth: undefined }]
  })
}

function convertObjectLiteralToJSON (value: object): object {
  return JSON.parse(JSON.stringify(value))
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

      expect(convertObjectLiteralToJSON(ClaimModelConverter.convert(claimDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(claimData))
    })
  })
})
