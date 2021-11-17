/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { ClaimModelConverter } from 'claims/claimModelConverter'

import { DraftClaim } from 'drafts/models/draftClaim'
import { claimDraft as draftTemplate } from 'test/data/draft/claimDraft'
import {
  companyDetails,
  defendantIndividualDetails,
  defendantSoleTraderDetails,
  individualDetails,
  organisationDetails,
  soleTraderDetailsWithSeparatedName
} from 'test/data/draft/partyDetails'

import { ClaimData } from 'claims/models/claimData'
import { claimData as entityTemplate } from 'test/data/entity/claimData'
import {
  company,
  individual,
  individualDefendant,
  organisation,
  soleTrader,
  soleTraderDefendant
} from 'test/data/entity/party'
import { YesNoOption } from 'models/yesNoOption'
import { Interest } from 'claim/form/models/interest'
import { InterestRateOption } from 'claim/form/models/interestRateOption'
import { InterestTypeOption } from 'claim/form/models/interestType'
import { Individual } from 'claims/models/details/theirs/individual'

function prepareClaimDraft (claimantPartyDetails: object, defendantPartyDetails: object, helpWithFeesEnabled?: boolean): DraftClaim {
  return new DraftClaim().deserialize({
    ...draftTemplate,
    claimant: { ...draftTemplate.claimant, partyDetails: claimantPartyDetails },
    defendant: {
      ...draftTemplate.defendant,
      partyDetails: { ...defendantPartyDetails, hasCorrespondenceAddress: false, correspondenceAddress: undefined }
    },
    helpWithFees: {
      declared:  helpWithFeesEnabled ? YesNoOption.YES : YesNoOption.NO,
      helpWithFeesNumber: helpWithFeesEnabled ? '098765' : '123456'
    }
  })
}

function prepareClaimData (claimantParty: object, defendantParty: object): ClaimData {
  return new ClaimData().deserialize({
    ...entityTemplate,
    claimants: [{ ...claimantParty, email: undefined, phone: '07000000000' }],
    defendants: [{ ...defendantParty, email: 'defendant@example.com', dateOfBirth: undefined, phone: '07284798778' }]
  })
}

function convertObjectLiteralToJSON (value: object): object {
  return JSON.parse(JSON.stringify(value))
}

describe('ClaimModelConverter', () => {
  [
    [[individualDetails, individual], [defendantSoleTraderDetails, soleTraderDefendant]],
    [[soleTraderDetailsWithSeparatedName, soleTrader], [companyDetails, company]],
    [[companyDetails, company], [organisationDetails, organisation]],
    [[organisationDetails, organisation], [defendantIndividualDetails, individualDefendant]]
  ].forEach(entry => {
    const [[claimantPartyDetails, claimantParty], [defendantPartyDetails, defendantParty]] = entry

    it(`should convert claim issued by ${claimantParty.type} against ${defendantParty.type} with same interest rate`, () => {
      const claimDraft = prepareClaimDraft(claimantPartyDetails, defendantPartyDetails)
      const claimData = prepareClaimData(claimantParty, defendantParty)

      expect(convertObjectLiteralToJSON(ClaimModelConverter.convert(claimDraft)))
        .to.deep.equal(convertObjectLiteralToJSON(claimData))
    })

    it(`should convert claim issued by ${claimantParty.type} against ${defendantParty.type} with interest rate breakdown`, () => {
      const claimDraft = prepareClaimDraft(claimantPartyDetails, defendantPartyDetails)
      claimDraft.interestType.option = InterestTypeOption.BREAKDOWN
      claimDraft.interestContinueClaiming.option = YesNoOption.YES
      claimDraft.interestHowMuch.type = InterestRateOption.STANDARD

      const converted = ClaimModelConverter.convert(claimDraft)
      expect(converted.interest.type).to.equal('breakdown')
    })

    it(`should convert claim issued by ${claimantParty.type} against ${defendantParty.type} with interest rate different`, () => {
      const claimDraft = prepareClaimDraft(claimantPartyDetails, defendantPartyDetails)
      claimDraft.interestType.option = InterestTypeOption.BREAKDOWN
      claimDraft.interestContinueClaiming.option = YesNoOption.YES
      claimDraft.interestHowMuch.type = InterestRateOption.DIFFERENT

      const converted = ClaimModelConverter.convert(claimDraft)
      expect(converted.interest.type).to.equal('breakdown')
    })
  })

  it('should not create interestDate if no interest is selected in the draft', () => {
    const claimDraft = prepareClaimDraft(individualDetails, individual)
    claimDraft.interest = new Interest(YesNoOption.NO)
    const converted: ClaimData = ClaimModelConverter.convert(claimDraft)
    expect(converted.interest.interestDate).to.be.undefined
  })

  it('should not contain title if blank', () => {
    const defendantWithoutTitle = { ...individualDefendant, title: ' ' }
    const claimDraft = prepareClaimDraft(defendantIndividualDetails, defendantWithoutTitle)
    const converted: ClaimData = ClaimModelConverter.convert(claimDraft)
    expect((converted.defendant as Individual).title).to.be.undefined
  })

  it('should not contain helpWithFeesNumber and helpWithFeesType if hwf is not provided', () => {
    const defendantWithoutTitle = { ...individualDefendant, title: ' ' }
    const claimDraft = prepareClaimDraft(defendantIndividualDetails, defendantWithoutTitle)
    const converted: ClaimData = ClaimModelConverter.convert(claimDraft)
    expect(converted.helpWithFeesNumber).to.be.undefined
    expect(converted.helpWithFeesType).to.be.undefined
  })

  it('should return helpWithFeesNumber and helpWithFeesType if hwf is provided', () => {
    const defendantWithoutTitle = { ...individualDefendant, title: ' ' }
    const claimDraft = prepareClaimDraft(defendantIndividualDetails, defendantWithoutTitle, true)
    const converted: ClaimData = ClaimModelConverter.convert(claimDraft)
    // console.log(converted)
    expect(converted.helpWithFeesNumber).to.equal('098765')
    expect(converted.helpWithFeesType).to.equal('Claim Issue')
  })
})
