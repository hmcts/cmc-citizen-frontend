import * as RouteHelper from 'test/features/directions-questionnaire/routes/helper/dqRouteHelper'
import { PartyType } from 'integration-test/data/party-type'
import { expect } from 'chai'
import { MadeBy } from 'claims/models/madeBy'
import { getPreferredParty } from 'directions-questionnaire/helpers/directionsQuestionnaireHelper'
import { Claim } from 'claims/models/claim'

describe('directionsQuestionnaireHelper', () => {
  describe('getPreferredParty', () => {
    it('When claim is individual vs individual, should return defendant', () => {
      const claim: Claim = new Claim().deserialize(RouteHelper.createClaim(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL))
      expect(getPreferredParty(claim))
        .to.equal(MadeBy.DEFENDANT)
    })

    it('When claim is individual vs business, should return claimant', () => {
      const claim: Claim = new Claim().deserialize(RouteHelper.createClaim(PartyType.INDIVIDUAL, PartyType.ORGANISATION))
      expect(getPreferredParty(claim))
        .to.equal(MadeBy.CLAIMANT)
    })

    it('When claim is business vs individual, should return defendant', () => {
      const claim: Claim = new Claim().deserialize(RouteHelper.createClaim(PartyType.ORGANISATION, PartyType.INDIVIDUAL))
      expect(getPreferredParty(claim))
        .to.equal(MadeBy.DEFENDANT)
    })

    it('When claim is business vs business, should return claimant', () => {
      const claim: Claim = new Claim().deserialize(RouteHelper.createClaim(PartyType.ORGANISATION, PartyType.ORGANISATION))
      expect(getPreferredParty(claim))
        .to.equal(MadeBy.CLAIMANT)
    })
  })
})
