import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from './data/EndToEndTestData'
import { DefenceType } from 'integration-test/data/defence-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { createClaimData } from 'integration-test/data/test-data'
import { DashboardClaimDetails } from 'integration-test/tests/citizen/defence/pages/defendant-claim-details'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const defendantDetails: DashboardClaimDetails = new DashboardClaimDetails()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
let testData
let claimData

Feature('Full Defence E2E')

Before(async (I: I) => {
  testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  claimData = await createClaimData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.defenceType = DefenceType.FULL_REJECTION_WITH_DISPUTE
  testData.defendantClaimsToHavePaidInFull = true
  await helperSteps.finishResponse(testData)

  I.see(testData.claimRef)
  I.click('My account')
  I.click(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Your response to the claim')
  I.see('You have rejected the claim')
  defendantDetails.clickViewClaim()
  defendantDetails.checkClaimData(testData.claimRef, claimData)
  I.click('Sign out')

  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Decide whether to proceed')
  I.see('Mrs. Rose Smith has rejected your claim.')
  I.click('View and respond')
})

Scenario('Reject/Dispute all of the claim... @citizen', { retries: 3 }, async (I: I) => {
  claimantResponseSteps.decideToProceed()
  checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType)
  I.see('You’ve rejected their response')
})

Scenario('Claimant Stop the claim /Case Stayed E2E... @nightly @citizen', { retries: 3 }, async (I: I) => {
  claimantResponseSteps.decideNotToProceed()
})
