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

Feature('Offers')

BeforeSuite(async (I: I) => {
  claimantEmail = userSteps.getClaimantEmail()
  defendantEmail = userSteps.getDefendantEmail()

  claimRef = await I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL), claimantEmail)
  I.respondToClaim(claimRef, claimantEmail, createResponseData(PartyType.INDIVIDUAL), defendantEmail)

  userSteps.login(defendantEmail)
  offerSteps.makeOfferFromDashboard(claimRef)
  I.see('We’ve sent your offer to ' + createClaimant(PartyType.INDIVIDUAL).name)
  I.click('Sign out')

  userSteps.login(claimantEmail)

})

Scenario('I can as a defendant make an offer, accept offer and counter sign the agreement @citizen @nightly', { retries: 3 }, async (I: I) => {
  offerSteps.acceptOfferFromDashboard(claimRef)
  I.click('Sign out')

  userSteps.login(defendantEmail)
  offerSteps.countersignOfferFromDashboard(claimRef)
  offerSteps.viewClaimFromDashboard(claimRef)

  I.see('You’ve both signed a legal agreement. The claim is now settled.')
})

Scenario('I can make an offer as a defendant to a claimant and have the claimant reject it @citizen @nightly', { retries: 3 }, async (I: I) => {
  offerSteps.rejectOfferFromDashboard(claimRef)
  I.click('Sign out')

  userSteps.login(defendantEmail)
  offerSteps.viewClaimFromDashboard(claimRef)

  I.see('The claimant has rejected your offer to settle the claim.')
})
