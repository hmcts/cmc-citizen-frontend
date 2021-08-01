import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from './data/EndToEndTestData'
import { DefenceType } from 'integration-test/data/defence-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { ClaimantResponseTestData } from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'
import { DefendantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/defendant'
const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const defendantResponseSteps: DefendantResponseSteps = new DefendantResponseSteps()
let testData

Feature('Full Defence E2E Journeys ')

Before(async (I: I) => {
  testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
})

Scenario('I can as an Individual make a claim against an Individual who then fully rejects the claim as they have already paid the full amount and I proceed with the claim @citizen', { retries: 3 }, async (I: I) => {
  testData.defenceType = DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID
  await helperSteps.finishResponse(testData)
  I.click('My account')
  I.see(testData.claimRef)
  I.click(testData.claimRef)
  I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim`)
  I.click('Sign out')

  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Decide whether to proceed')
  I.see('Mrs. Rose Smith has rejected your claim.')
  I.click('View and respond')
  claimantResponseSteps.rejectFullDefencePaidFullAmount(testData)
  I.see('You’ve rejected their response')
})
