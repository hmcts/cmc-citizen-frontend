import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { PaymentOption } from 'integration-test/data/payment-option'
import { ClaimantConfirmation } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-confirmation'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import {
  ClaimantResponseTestData,
  UnreasonableClaimantResponseTestData
} from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const confirmationPage: ClaimantConfirmation = new ClaimantConfirmation()

let testData

Feature('Claimant Response Fully Admit E2E Tests...')

Before(async (I: I) => {
  testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
})

if (process.env.FEATURE_ADMISSIONS === 'true') {

  Scenario('Defendant agreed to pay all of the claim via immediate payment route... @fullAdmission @citizen @admissions', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.IMMEDIATELY
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
    I.see(testData.claimRef)
    I.see('The defendant said they’ll pay you immediately')
    I.click('My account')
    I.see(testData.claimRef)
    I.see('Wait for the defendant to pay you')
  })

  Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and accepting defendants payment method @citizen @admissions', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.BY_SET_DATE
    const claimantResponseTestData = new ClaimantResponseTestData()
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptSettlementFromDashboardWhenAcceptPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer')
    checkAndSendPage.verifyFactsForSettlement()
    I.click('input[type=submit]')
    I.see('You’ve signed a settlement agreement')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement')
  })
}
