import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { PaymentOption } from 'integration-test/data/payment-option'
import { ClaimantConfirmation } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-confirmation'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { ClaimantResponseTestData } from './data/ClaimantResponseTestData'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const confirmationPage: ClaimantConfirmation = new ClaimantConfirmation()

Feature('Claimant Response').retry(3)

Scenario('I can as a claimant view the defendants full admission with immediate payment @citizen @admissions', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  // as defendant
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef, false)
  I.see(testData.claimRef)
  I.see('The defendant said they’ll pay you immediately')
  I.click('My account')
  I.see(testData.claimRef)
  I.see('The defendant admits they owe all the money. They’ve said that they will pay immediately.')
})

Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and accepting defendants payment method @citizen @admissions', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.BY_SET_DATE
  // as defendant
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.acceptSettlementFromDashboardWhenAcceptPaymentMethod(testData)
  checkAndSendPage.verifyFactsForSettlement()
  checkAndSendPage.checkFactsTrueAndSubmit()
  I.see('You’ve accepted the repayment plan')
  confirmationPage.clickGoToYourAccount()
  I.see(testData.claimRef)
  I.see('You’ve signed a settlement agreement')
})

Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of immediate payment @citizen @admissions @error', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.BY_SET_DATE
  testData.claimantPaymentOption = PaymentOption.IMMEDIATELY
  const claimantResponseTestData = new ClaimantResponseTestData()
  // as defendant
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData)
  checkAndSendPage.verifyFactsForSettlement()
  checkAndSendPage.checkFactsTrueAndSubmit()
  I.see('422 - "courtDetermination.courtPaymentIntention : must not be null"')
  // confirmationPage.clickGoToYourAccount()
  // I.see(testData.claimRef)
  // I.see('You’ve signed a settlement agreement')
})

Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of set date @citizen @admissions @error', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.BY_SET_DATE
  testData.claimantPaymentOption = PaymentOption.BY_SET_DATE
  const claimantResponseTestData = new ClaimantResponseTestData()
  // as defendant
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData)
  I.see('Error: (/usr/src/app/src/main/features/claimant-response/views/check-and-send.njk)')
  // checkAndSendPage.verifyFactsForSettlement()
  // checkAndSendPage.checkFactsTrueAndSubmit()
  // confirmationPage.clickGoToYourAccount()
  // I.see(claim.claimRef)
  // I.see('You’ve signed a settlement agreement')

})

// TODO: confirm this journey
Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of instalments @admissions @citizen', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.BY_SET_DATE
  testData.claimantPaymentOption = PaymentOption.INSTALMENTS
  const claimantResponseTestData = new ClaimantResponseTestData()
  // as defendant
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData)
  checkAndSendPage.verifyFactsForSettlement()
  checkAndSendPage.checkFactsTrueAndSubmit()
  I.see('You’ve proposed an alternative repayment plan')
  confirmationPage.clickGoToYourAccount()
  I.see(testData.claimRef)
  I.see('You’ve signed a settlement agreement')
})

Scenario('I can as a claimant accept the defendants full admission by set date with CCJ and no previous payments made @admissions @citizen', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.BY_SET_DATE
  // as defendant
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.acceptCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod(testData)
  I.see(testData.claimRef)
  I.see('A County Court Judgment has been issued.')
})

Scenario('I can as a claimant accept the defendants full admission by set date with CCJ and a previous payment made @admissions @citizen', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.BY_SET_DATE
  // as defendant
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod(testData)
  I.see(testData.claimRef)
  I.see('A County Court Judgment has been issued.')
})
