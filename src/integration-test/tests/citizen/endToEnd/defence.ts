import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from './data/EndToEndTestData'
import { DefenceType } from 'integration-test/data/defence-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { createClaimData } from 'integration-test/data/test-data'
import { DashboardClaimDetails } from 'integration-test/tests/citizen/defence/pages/defendant-claim-details'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const defendantDetails: DashboardClaimDetails = new DashboardClaimDetails()

Feature('E2E tests for defence journeys')

Scenario('I can as an Individual make a claim against an Individual who then fully defends and I proceed with the claim @citizen', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.defenceType = DefenceType.FULL_REJECTION_WITH_DISPUTE
  testData.defendantClaimsToHavePaidInFull = true
  helperSteps.finishResponse(testData)

  I.see(testData.claimRef)
  // check dashboard
  I.click('My account')
  // check status
  I.click(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Claim status')
  I.see('Your response to the claim')
  I.see('You have rejected the claim')
  defendantDetails.clickViewClaim()
  defendantDetails.checkClaimData(testData.claimRef, claimData)
  I.click('Sign out')

  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Claim status')
  I.see('Decide whether to proceed')
  I.see('Mrs. Rose Smith has rejected your claim.')
  I.click('View and respond')
  claimantResponseSteps.decideToProceed()
  I.see('You’ve rejected their response')
})

Scenario('I can as an Individual make a claim against an Individual who then fully rejects the claim as they have already paid and I proceed with the claim @citizen', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.defenceType = DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID
  helperSteps.finishResponse(testData)
  I.click('My account')
  I.see(testData.claimRef)
  I.click(testData.claimRef)
  I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim`)
  I.click('Sign out')

  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Claim status')
  I.see('Decide whether to proceed')
  I.see('Mrs. Rose Smith has rejected your claim.')
  I.click('View and respond')
  claimantResponseSteps.decideToProceed()
  I.see('You’ve rejected their response')
})
