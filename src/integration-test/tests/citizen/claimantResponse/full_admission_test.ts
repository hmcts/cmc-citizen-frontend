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

Feature('Claimant Response Fully Admit E2E Tests')

Before(async (I: I) => testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL))

if (process.env.FEATURE_ADMISSIONS === 'true') {

  Scenario('I can as a claimant view the defendants full admission with immediate payment @citizen @admissions', { retries: 3 }, async (I: I) => {
    // const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
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

  Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of immediate payment @nightly @admissions', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.BY_SET_DATE
    testData.claimantPaymentOption = PaymentOption.IMMEDIATELY
    const claimantResponseTestData = new ClaimantResponseTestData()
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.submitNoDq()
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement')
  })

  Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of set date @nightly @admissions', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.BY_SET_DATE
    testData.claimantPaymentOption = PaymentOption.BY_SET_DATE
    const claimantResponseTestData = new ClaimantResponseTestData()
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.submitNoDq()
    I.see('You’ve proposed a different repayment plan')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement')
  })

  Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of instalments @nightly @admissions', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.BY_SET_DATE
    testData.claimantPaymentOption = PaymentOption.INSTALMENTS
    const claimantResponseTestData = new ClaimantResponseTestData()
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.submitNoDq()
    I.see('You’ve proposed a different repayment plan')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement')
  })

  Scenario('I can as a claimant accept the defendants full admission by instalments with settlement agreement and rejecting defendants payment method in favour of courts proposed repayment plan @citizen @admissions', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.INSTALMENTS
    testData.claimantPaymentOption = PaymentOption.INSTALMENTS
    const unreasonableClaimantResponseTestDate = new UnreasonableClaimantResponseTestData()
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptCourtOfferedRepaymentPlan(testData, unreasonableClaimantResponseTestDate, 'View and respond to the offer')
    checkAndSendPage.verifyFactsForSettlement()
    I.see('The court rejected your repayment plan and calculated a more affordable one')
    I.click('input[type=submit]')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement')
  })

  Scenario('I can as a claimant accept the defendants full admission by set date with CCJ and no previous payments made @admissions @citizen', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.BY_SET_DATE
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod(testData, 'View and respond to the offer')
    I.see('County Court Judgment requested')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('County Court Judgment')
  })

  Scenario('I can as a claimant accept the defendants full admission by set date with CCJ and a previous payment made @admissions @citizen', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.BY_SET_DATE
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod(testData, 'View and respond to the offer')
    I.see('County Court Judgment requested')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('County Court Judgment')
  })

  Scenario('I can as a claimant accept the defendants full admission by instalments and reject defendants payment method in favour of repayment plan, accepting court determination, requesting CCJ then finally settling @citizen @admissions @nightly', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.INSTALMENTS
    testData.claimantPaymentOption = PaymentOption.INSTALMENTS
    const claimantResponseTestData = new UnreasonableClaimantResponseTestData()
    claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage = true
    claimantResponseTestData.pageSpecificValues.settleClaimEnterDate = '2019-01-01'
    // as defendant
    helperSteps.finishResponseWithFullAdmission(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptCcjFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer')
    I.see('County Court Judgment requested')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('County Court Judgment')
    claimantResponseSteps.settleClaim(testData, claimantResponseTestData, 'Tell us you’ve been paid')
    I.see('The claim is now settled')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('This claim is settled.')
  })
}
