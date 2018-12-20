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
import { PaidInFullSteps } from 'integration-test/tests/citizen/dashboard/steps/paid-in-full'

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
    helperSteps.finishResponse(testData, false)
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
    claimantResponseSteps.signSettlementFromDashboardWhenAcceptPaymentMethod(testData, claimantResponseTestData, 'View and respond')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve signed a settlement agreement')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
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
    claimantResponseSteps.signSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve signed a settlement agreement')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
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
    claimantResponseSteps.signSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve signed a settlement agreement')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
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
    claimantResponseSteps.signSettlementFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond')
    checkAndSendPage.verifyFactsForSettlement()
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see('You’ve proposed a different repayment plan')
    confirmationPage.clickGoToYourAccount()
    I.see(testData.claimRef)
    I.see('You’ve signed a settlement agreement.')
  })

  Scenario('I can as a claimant accept the defendants part admission by set date but request CCJ @citizen @admissions', async (I: I) => {

    const defendantPartAdmissionPayingBySetDate = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    defendantPartAdmissionPayingBySetDate.paymentOption = PaymentOption.BY_SET_DATE
    defendantPartAdmissionPayingBySetDate.defenceType = DefenceType.PART_ADMISSION
    defendantPartAdmissionPayingBySetDate.defendantClaimsToHavePaidInFull = false
    const claimantResponseTestData = new ClaimantResponseTestData()
    const paidInFullSteps: PaidInFullSteps = new PaidInFullSteps()
    claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true
    // as defendant
    helperSteps.finishResponse(defendantPartAdmissionPayingBySetDate)
    I.click('Sign out')
    // as claimant
    userSteps.login(defendantPartAdmissionPayingBySetDate.claimantEmail)
    claimantResponseSteps.requestCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod(
        defendantPartAdmissionPayingBySetDate, claimantResponseTestData,'View and respond')
    I.see('County Court Judgment requested')
    confirmationPage.clickGoToYourAccount()
    I.click(defendantPartAdmissionPayingBySetDate.claimRef)
    I.see(defendantPartAdmissionPayingBySetDate.claimRef)
    I.see('Tell us you’ve been paid')
    I.click('Tell us you’ve been paid')
    paidInFullSteps.inputDatePaid('2017-01-01')
    I.see('The claim is now settled')
  })

  Scenario('I can as a claimant accept the defendants part admission by instalments but request CCJ @citizen @admissions', async (I: I) => {

    const defendantPartAdmissionPayingByInstallments = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    defendantPartAdmissionPayingByInstallments.paymentOption = PaymentOption.INSTALMENTS
    defendantPartAdmissionPayingByInstallments.defenceType = DefenceType.PART_ADMISSION
    defendantPartAdmissionPayingByInstallments.defendantClaimsToHavePaidInFull = false
    const claimantResponseTestData = new ClaimantResponseTestData()
    const paidInFullSteps: PaidInFullSteps = new PaidInFullSteps()
    claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true
    // as defendant
    helperSteps.finishResponse(defendantPartAdmissionPayingByInstallments)
    I.click('Sign out')
    // as claimant
    userSteps.login(defendantPartAdmissionPayingByInstallments.claimantEmail)
    claimantResponseSteps.requestCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod(
        defendantPartAdmissionPayingByInstallments, claimantResponseTestData,'View and respond')
    I.see('County Court Judgment requested')
    confirmationPage.clickGoToYourAccount()
    I.click(defendantPartAdmissionPayingByInstallments.claimRef)
    I.see(defendantPartAdmissionPayingByInstallments.claimRef)
    I.see('Tell us you’ve been paid')
    I.click('Tell us you’ve been paid')
    paidInFullSteps.inputDatePaid('2017-01-01')
    I.see('The claim is now settled')
  })
}
