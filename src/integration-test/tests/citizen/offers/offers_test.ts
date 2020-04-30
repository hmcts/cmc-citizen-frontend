import { PartyType } from 'integration-test/data/party-type'
import { createClaimant, createClaimData, createResponseData } from 'integration-test/data/test-data'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { OfferSteps } from 'integration-test/tests/citizen/offers/steps/offer'
import I = CodeceptJS.I

const userSteps: UserSteps = new UserSteps()
const offerSteps: OfferSteps = new OfferSteps()

Feature('Offers')

Scenario('I can as a defendant make an offer, accept offer and counter sign the agreement @citizen', { retries: 3 }, async (I: I, loginAs) => {
  const claimantEmail: string = userSteps.getClaimantEmail()
  const defendantEmail: string = userSteps.getDefendantEmail()

  const claimRef: string = await I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL), claimantEmail)

  I.respondToClaim(claimRef, claimantEmail, createResponseData(PartyType.INDIVIDUAL), defendantEmail)

  await I.loggedInAs(await loginAs('defendant').then(() => 'Defendant'))
  offerSteps.makeOfferFromDashboard(claimRef)
  I.see('We’ve sent your offer to ' + createClaimant(PartyType.INDIVIDUAL).name)
  await I.click('Sign out')
  // as claimant
  await I.loggedInAs(await loginAs('claimant').then(() => 'Claimant'))
  offerSteps.acceptOfferFromDashboard(claimRef)
  await I.click('Sign out')

  await I.loggedInAs(await loginAs('defendant').then(() => 'Defendant'))
  offerSteps.countersignOfferFromDashboard(claimRef)
  offerSteps.viewClaimFromDashboard(claimRef)
  I.see('You’ve both signed a legal agreement. The claim is now settled.')
})

Scenario('I can make an offer as a defendant to a claimant and have the claimant reject it @nightly', { retries: 3 }, async (I: I, loginAs) => {
  const claimantEmail: string = userSteps.getClaimantEmail()
  const defendantEmail: string = userSteps.getDefendantEmail()

  const claimRef: string = await I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL), claimantEmail)

  I.respondToClaim(claimRef, claimantEmail, createResponseData(PartyType.INDIVIDUAL), defendantEmail)

  await I.loggedInAs(await loginAs('defendant').then(() => 'Defendant'))
  offerSteps.makeOfferFromDashboard(claimRef)
  I.see('We’ve sent your offer to ' + createClaimant(PartyType.INDIVIDUAL).name)
  await I.click('Sign out')
  // as claimant
  await I.loggedInAs(await loginAs('claimant').then(() => 'Claimant'))
  offerSteps.rejectOfferFromDashboard(claimRef)
  await I.click('Sign out')

  await I.loggedInAs(await loginAs('defendant').then(() => 'Defendant'))
  offerSteps.viewClaimFromDashboard(claimRef)
  I.see('The claimant has rejected your offer to settle the claim.')
})
