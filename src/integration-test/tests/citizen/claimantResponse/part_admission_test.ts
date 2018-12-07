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
  Feature('Claimant Response: Part Admit').retry(3)

  Scenario('I can as a claimant reject the defendants part admission by immediately @citizen @admissions', async (I: I) => {

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
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
    claimantResponseSteps.respondToOffer('View and respond')
    claimantResponseSteps.reject(testData, claimantResponseTestData)
    checkAndSendPage.verifyFactsForPartAdmitRejection()
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve rejected their response')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve rejected the defendant’s admission. They said they owe £50')
  })

  Scenario('I can as a claimant accept the defendants part admission by immediately with settlement agreement and accepting defendants payment method @citizen @admissions', async (I: I) => {

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
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve accepted the repayment plan')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
    I.click(testData.claimRef)
    I.see('you need to tell us')
  })

  Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of immediate payment @citizen @admissions', async (I: I) => {

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
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve accepted the repayment plan')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
    I.click(testData.claimRef)
    I.see('you need to tell us')
  })

  Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of set date @citizen @admissions', async (I: I) => {

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
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve accepted the repayment plan')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
    I.click(testData.claimRef)
    I.see('you need to tell us')
  })

  Scenario('I can as a claimant accept the defendants part admission by instalments with settlement agreement and rejecting defendants payment method in favour of instalments @citizen @admissions', async (I: I) => {

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
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve proposed an alternative repayment plan')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
    I.click(testData.claimRef)
    I.see('you need to tell us')
  })
}
