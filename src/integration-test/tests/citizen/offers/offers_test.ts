import { PartyType } from 'integration-test/data/party-type'
import { createClaimant, createClaimData, createResponseData } from 'integration-test/data/test-data'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { OfferSteps } from 'integration-test/tests/citizen/offers/steps/offer'
import I = CodeceptJS.I

const userSteps: UserSteps = new UserSteps()
const offerSteps: OfferSteps = new OfferSteps()

let claimantEmail
let defendantEmail
let claimRef

Feature('Full Defence Offer E2E Tests (via) Settle Out Of Court route ')

Before(async (I: I) => {
  claimantEmail = await I.getClaimantEmail()
  defendantEmail = await I.getDefendantEmail()

  claimRef = await I.createClaim(await createClaimData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL), claimantEmail)
  I.respondToClaim(claimRef, claimantEmail, await createResponseData(I, PartyType.INDIVIDUAL), defendantEmail)

  userSteps.login(defendantEmail)
  offerSteps.makeOfferFromDashboard(claimRef)
  I.see('We’ve sent your offer to ' + createClaimant(PartyType.INDIVIDUAL).name)
  I.click('Sign out')

})
