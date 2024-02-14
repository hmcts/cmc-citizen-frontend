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

xScenario('Claimant Accepted Offer @nightly @citizen', { retries: 3 }, async (I: I) => {
  userSteps.login(claimantEmail)
  offerSteps.acceptOfferFromDashboard(claimRef)
  I.seeTitleEquals('Confirmation - Money Claims')
  I.click('Sign out')
})

xScenario('Defendant Countersigned Offer @nightly @citizen', { retries: 3 }, async (I: I) => {
  userSteps.login(claimantEmail)
  offerSteps.acceptOfferFromDashboard(claimRef)
  I.click('Sign out')

  userSteps.login(defendantEmail)
  offerSteps.countersignOfferFromDashboard(claimRef)
  offerSteps.viewClaimFromDashboard(claimRef)
})

// xScenario('Claimant Rejected Offer @citizen @nightly', { retries: 3 }, async (I: I) => {
//   userSteps.login(claimantEmail)
//   offerSteps.rejectOfferFromDashboard(claimRef)
//   I.click('Sign out')
//
//   userSteps.login(defendantEmail)
//   offerSteps.viewClaimFromDashboard(claimRef)
//
//   I.see('The claimant has rejected your offer to settle the claim.')
// })

Scenario('Settle Out Of Court E2E @nightly', { retries: 3 }, async (I: I) => {
  userSteps.login(claimantEmail)
  offerSteps.acceptOfferFromDashboard(claimRef)
  I.click('Sign out')

  userSteps.login(defendantEmail)
  offerSteps.countersignOfferFromDashboard(claimRef)
  offerSteps.viewClaimFromDashboard(claimRef)

  I.see('You’ve both signed a legal agreement. The claim is now settled.')
})
