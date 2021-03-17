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

Scenario('I can as an Individual make a claim against an Individual who then rejects the claim as they have paid the full amount then I accept the defence @nightly', { retries: 3 }, async (I: I) => {
  const claimantResponseTestData = new ClaimantResponseTestData()
  claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation = {
    paidAmount: 105.5,
    date: '2018-01-01',
    explanation: 'My explanation...'
  }
  // as defendant
  await defendantResponseSteps.disputeClaimAsAlreadyPaid(I, testData, claimantResponseTestData, true)
  I.see(testData.claimRef)
  I.see(`You told us you’ve paid £105.50. We’ve sent ${testData.claimantName} this response`)
  // check dashboard
  I.click('My account')
  I.see('Wait for the claimant to respond')
  // check status
  I.click(testData.claimRef)
  I.see(testData.claimRef)
  I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  // check dashboard
  I.click('My account')
  I.see(testData.claimRef)
  I.see('Decide whether to proceed')
  I.click(testData.claimRef)
  I.see(testData.claimRef)
  I.see(`${testData.defendantName} has rejected your claim.`)
  I.click('View and respond')
  claimantResponseSteps.acceptFullDefencePaidFullAmount(testData)
  I.click('Sign out')
})

Scenario('I can as an Individual make a claim against an Individual who then rejects the claim as they have paid less than the amount claimed and I then accept their defence @nightly', { retries: 3 }, async (I: I) => {
  const claimantResponseTestData = new ClaimantResponseTestData()
  claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation = {
    paidAmount: 50,
    date: '2018-01-01',
    explanation: 'My explanation...'
  }
  // as defendant
  await defendantResponseSteps.disputeClaimAsAlreadyPaid(I, testData, claimantResponseTestData, false)
  I.see(testData.claimRef)
  I.see(`You told us you’ve paid the £${Number(50).toLocaleString()} you believe you owe. We’ve sent ${testData.claimantName} this response.`)
  // check dashboard
  I.click('My account')
  I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`)
  // check status
  I.click(testData.claimRef)
  I.see(testData.claimRef)
  I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  I.see(`Respond to the defendant.`)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Respond to the defendant')
  I.see(`${testData.defendantName} says they paid you £50 on 1 January 2018.`)
  I.click('Respond')
  claimantResponseSteps.acceptFullDefencePaidLessThanFullAmount()
  I.click('Sign out')
})

Scenario('I can as an Individual make a claim against an Individual who then rejects the claim as they have paid less than the amount claimed and I then proceed with the claim @citizen', { retries: 3 }, async (I: I) => {
  const claimantResponseTestData = new ClaimantResponseTestData()
  claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation = {
    paidAmount: 50,
    date: '2018-01-01',
    explanation: 'My explanation...'
  }
  // as defendant
  await defendantResponseSteps.disputeClaimAsAlreadyPaid(I, testData, claimantResponseTestData, false)
  I.see(testData.claimRef)
  I.see(`You told us you’ve paid the £${Number(50).toLocaleString()} you believe you owe. We’ve sent ${testData.claimantName} this response.`)
  // check dashboard
  I.click('My account')
  I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`)
  // check status
  I.click(testData.claimRef)
  I.see(testData.claimRef)
  I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim.`)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  I.see(`Respond to the defendant.`)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.see('Respond to the defendant')
  I.see(`${testData.defendantName} says they paid you £50 on 1 January 2018.`)
  I.click('Respond')
  claimantResponseSteps.rejectFullDefencePaidLessThanFullAmount(testData)
  I.click('Sign out')
})
