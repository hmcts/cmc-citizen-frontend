import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { DefenceType } from 'integration-test/data/defence-type'
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

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Feature('Claimant Response: Part Admit')

  Scenario('I can as a claimant reject the defendants part admission by immediately @nightly @admissions', { retries: 3 }, async (I: I) => {

    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.paymentOption = PaymentOption.IMMEDIATELY
    testData.defenceType = DefenceType.PART_ADMISSION
    testData.defendantClaimsToHavePaidInFull = false
    const claimantResponseTestData = new ClaimantResponseTestData()
    claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true
    // as defendant
    helperSteps.finishResponse(testData, false)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
    claimantResponseSteps.respondToOffer('View and respond')
    claimantResponseSteps.reject(testData, claimantResponseTestData)
    checkAndSendPage.verifyFactsForPartAdmitRejection()
    checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType)
    I.see('You agreed to try to resolve the claim using mediation')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('We’ll contact you to try to arrange a mediation appointment')
  })

  Scenario('I can as a claimant accept the defendants part admission by immediately with settlement agreement and accepting defendants payment method @nightly @admissions', { retries: 3 }, async (I: I) => {

    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.paymentOption = PaymentOption.IMMEDIATELY
    testData.defenceType = DefenceType.PART_ADMISSION
    testData.defendantClaimsToHavePaidInFull = false
    const claimantResponseTestData = new ClaimantResponseTestData()
    claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true
    // as defendant
    helperSteps.finishResponse(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptSettlementFromDashboardWhenAcceptPaymentMethod(testData, claimantResponseTestData, 'View and respond')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.submitNoDq()
    I.see('You’ve signed a settlement agreement')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
  })

  Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of immediate payment @citizen @admissions', { retries: 3 }, async (I: I) => {

    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.paymentOption = PaymentOption.INSTALMENTS
    testData.defenceType = DefenceType.PART_ADMISSION
    testData.claimantPaymentOption = PaymentOption.IMMEDIATELY
    testData.defendantClaimsToHavePaidInFull = false
    const claimantResponseTestData = new ClaimantResponseTestData()
    claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true
    // as defendant
    helperSteps.finishResponse(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond')
    checkAndSendPage.verifyFactsForSettlement()
    I.click('input[type=submit]')
    I.see('You’ve signed a settlement agreement')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
  })

  Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of set date @nightly @admissions', { retries: 3 }, async (I: I) => {

    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.paymentOption = PaymentOption.INSTALMENTS
    testData.defenceType = DefenceType.PART_ADMISSION
    testData.claimantPaymentOption = PaymentOption.BY_SET_DATE
    testData.defendantClaimsToHavePaidInFull = false
    const claimantResponseTestData = new ClaimantResponseTestData()
    claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true
    claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage = true
    // as defendant
    helperSteps.finishResponse(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.submitNoDq()
    I.see('You’ve signed a settlement agreement')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
  })

  Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of instalments @nightly @admissions', { retries: 3 }, async (I: I) => {

    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.paymentOption = PaymentOption.BY_SET_DATE
    testData.defenceType = DefenceType.PART_ADMISSION
    testData.claimantPaymentOption = PaymentOption.INSTALMENTS
    testData.defendantClaimsToHavePaidInFull = false
    const claimantResponseTestData = new ClaimantResponseTestData()
    claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true
    // as defendant
    helperSteps.finishResponse(testData)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.submitNoDq()
    I.see('You’ve proposed a different repayment plan')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
  })
}
