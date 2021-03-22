import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from './data/EndToEndTestData'
import { DefenceType } from 'integration-test/data/defence-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from '../claimantResponse/steps/claimant-reponse'
const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
let testData

Feature('States Paid E2E')

Before(async (I: I) => {
  testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
})

Scenario('I have paid what i believe i owe @citizen @nightly', { retries: 3 }, async (I: I) => {
  testData.defenceType = DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID
  await helperSteps.finishResponse(testData)
  I.click('My account')
  I.click(testData.claimRef)
  I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim`)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.click('View and respond')
  claimantResponseSteps.acceptFullDefencePaidFullAmount(testData)
})
