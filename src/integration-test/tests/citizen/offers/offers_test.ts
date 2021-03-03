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
  claimantEmail = userSteps.getClaimantEmail()
  defendantEmail = userSteps.getDefendantEmail()

  claimRef = await I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL), claimantEmail)
  I.respondToClaim(claimRef, claimantEmail, createResponseData(PartyType.INDIVIDUAL), defendantEmail)

  userSteps.login(defendantEmail)
  offerSteps.makeOfferFromDashboard(claimRef)
  I.see('We’ve sent your offer to ' + createClaimant(PartyType.INDIVIDUAL).name)
  I.click('Sign out')

})

Scenario('Claimant Accepted Offer @nightly @citizen @e2e', { retries: 3 }, async (I: I) => {
  userSteps.login(claimantEmail)
  offerSteps.acceptOfferFromDashboard(claimRef)
  I.seeTitleEquals('Confirmation - Money Claims')
  I.click('Sign out')
}).retry(2)

Scenario('Defendant Countersigned Offer @nightly @citizen @e2e', { retries: 3 }, async (I: I) => {
  userSteps.login(claimantEmail)
  offerSteps.acceptOfferFromDashboard(claimRef)
  I.click('Sign out')

  userSteps.login(defendantEmail)
  offerSteps.countersignOfferFromDashboard(claimRef)
  offerSteps.viewClaimFromDashboard(claimRef)
}).retry(2)

Scenario('Claimant Rejected Offer @citizen @nightly @e2e', { retries: 3 }, async (I: I) => {
  userSteps.login(claimantEmail)
  offerSteps.rejectOfferFromDashboard(claimRef)
  I.click('Sign out')

  userSteps.login(defendantEmail)
  offerSteps.viewClaimFromDashboard(claimRef)

  I.see('The claimant has rejected your offer to settle the claim.')
}).retry(2)

Scenario('Settle Out Of Court E2E @nightly', { retries: 3 }, async (I: I) => {
  userSteps.login(claimantEmail)
  offerSteps.acceptOfferFromDashboard(claimRef)
  I.click('Sign out')

  userSteps.login(defendantEmail)
  offerSteps.countersignOfferFromDashboard(claimRef)
  offerSteps.viewClaimFromDashboard(claimRef)

  I.see('You’ve both signed a legal agreement. The claim is now settled.')
})
