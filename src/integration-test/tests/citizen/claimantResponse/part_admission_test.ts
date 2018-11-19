import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { DefenceType } from 'integration-test/data/defence-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { PaymentOption } from 'integration-test/data/payment-option'
// import { ClaimantConfirmation } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-confirmation'
// import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
// const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
// const confirmationPage: ClaimantConfirmation = new ClaimantConfirmation()

Feature('Claimant Response: Part Admit') // .retry(3)

Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and accepting defendants payment method @citizen @admissions @error @debug11', async (I: I) => {

  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  testData.defenceType = DefenceType.PART_ADMISSION
  // as defendant
  helperSteps.finishResponse(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)

  claimantResponseSteps.respondToOfferAndExpectBrokenTaskListPage(testData, 'Respond')
  // when fixed remove above line and uncomment below and imports

  // claimantResponseSteps.acceptSettlementFromDashboardWhenAcceptPaymentMethod(testData, 'Respond')
  // checkAndSendPage.verifyFactsForSettlement()
  // checkAndSendPage.checkFactsTrueAndSubmit()
  // I.see('You’ve accepted the repayment plan')
  // confirmationPage.clickGoToYourAccount()
  // I.see(testData.claimRef)
  // I.see('You’ve signed a settlement agreement.')
})

Scenario('I can as a claimant accept the defendants part admission by set date with settlement agreement and accepting defendants payment method @citizen @admissions @error @debug12', async (I: I) => {

  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  testData.defenceType = DefenceType.PART_ADMISSION
  // as defendant
  helperSteps.finishResponse(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)

  claimantResponseSteps.respondToOfferAndExpectBrokenTaskListPage(testData, 'Respond')
  // when fixed remove above line and uncomment below and imports

  // claimantResponseSteps.acceptSettlementFromDashboardWhenAcceptPaymentMethod(testData, 'Respond')
  // checkAndSendPage.verifyFactsForSettlement()
  // checkAndSendPage.checkFactsTrueAndSubmit()
  // I.see('You’ve accepted the repayment plan')
  // confirmationPage.clickGoToYourAccount()
  // I.see(testData.claimRef)
  // I.see('You’ve signed a settlement agreement.')
})
