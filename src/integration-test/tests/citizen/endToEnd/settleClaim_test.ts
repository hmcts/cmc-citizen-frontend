import I = CodeceptJS.I
import { PaymentOption } from '../../../data/payment-option'
import { UnreasonableClaimantResponseTestData } from '../claimantResponse/data/ClaimantResponseTestData'
import { EndToEndTestData } from './data/EndToEndTestData'
import { PartyType } from '../../../data/party-type'
import { Helper } from './steps/helper'
import { UserSteps } from '../home/steps/user'
import { ClaimantResponseSteps } from '../claimantResponse/steps/claimant-reponse'
import { ClaimantConfirmation } from '../claimantResponse/pages/claimant-confirmation'
const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const confirmationPage: ClaimantConfirmation = new ClaimantConfirmation()
let testData

Feature(' Settle Claim E2E')

Before(async (I: I) => {
  testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
})

Scenario('Full Admission-->Settle Claim(Pay By Installment) @citizen @nightly', { retries: 3 }, async (I: I) => {
  testData.paymentOption = PaymentOption.INSTALMENTS
  testData.claimantPaymentOption = PaymentOption.INSTALMENTS
  const claimantResponseTestData = new UnreasonableClaimantResponseTestData()
  claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage = true
  claimantResponseTestData.pageSpecificValues.settleClaimEnterDate = '2019-01-01'
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.acceptCcjFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer')
  I.see('County Court Judgment requested')
  confirmationPage.clickGoToYourAccount()
  I.see(testData.claimRef)
  claimantResponseSteps.settleClaim(testData, claimantResponseTestData, 'Tell us you’ve been paid')
  I.see('The claim is now settled')
  confirmationPage.clickGoToYourAccount()
  I.see(testData.claimRef)
  I.see('This claim is settled.')
})

Scenario('Full Admission-->Settle Claim(Pay By Set Date) @nightly', { retries: 3 }, async (I: I) => {
  testData.paymentOption = PaymentOption.BY_SET_DATE
  testData.claimantPaymentOption = PaymentOption.BY_SET_DATE
  const claimantResponseTestData = new UnreasonableClaimantResponseTestData()
  claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage = true
  claimantResponseTestData.pageSpecificValues.settleClaimEnterDate = '2019-01-01'
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.acceptCcjFromDashboardWhenRejectPaymentMethod(testData, claimantResponseTestData, 'View and respond to the offer')
  confirmationPage.clickGoToYourAccount()
  I.see(testData.claimRef)
  claimantResponseSteps.settleClaim(testData, claimantResponseTestData, 'Tell us you’ve been paid')
  I.see('The claim is now settled')
  confirmationPage.clickGoToYourAccount()
  I.see(testData.claimRef)
  I.see('This claim is settled.')
})

Scenario('Settle Claim(Pay Immediately) @citizen @nightly', { retries: 3 }, async (I: I) => {
  testData.claimantPaymentOption = PaymentOption.IMMEDIATELY
  const claimantResponseTestData = new UnreasonableClaimantResponseTestData()
  claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage = true
  claimantResponseTestData.pageSpecificValues.settleClaimEnterDate = '2019-01-01'
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  confirmationPage.clickGoToYourAccount()
  claimantResponseSteps.settleClaim(testData, claimantResponseTestData, 'Tell us you’ve settled')
  confirmationPage.clickGoToYourAccount()
  I.see(testData.claimRef)
  I.see('This claim is settled.')
})
