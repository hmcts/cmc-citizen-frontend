import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { PaymentOption } from 'integration-test/data/payment-option'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { DefenceType } from 'integration-test/data/defence-type'
import { ClaimantResponseTestData } from './data/ClaimantResponseTestData'

const helperSteps: Helper = new Helper()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Feature('Claimant Response ::: Part admit when defendant is business')

  Scenario('I can as a claimant accept and suggest an alternative payment intention with set date @nightly @admissions @business', { retries: 3 }, async (I: I, loginAs) => {
    const testData = await EndToEndTestData.prepareData(I, PartyType.COMPANY, PartyType.INDIVIDUAL)
    testData.defenceType = DefenceType.PART_ADMISSION_NONE_PAID
    testData.paymentOption = PaymentOption.BY_SET_DATE
    // as defendant
    await I.loggedInAs(await loginAs('defendant').then(() => 'Defendant'))
    helperSteps.finishResponse(testData, false)
    await I.click('Sign out')
    // as claimant
    await I.loggedInAs(await loginAs('claimant').then(() => 'Claimant'))
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
    I.click('View and respond')
    claimantResponseSteps.acceptPartAdmitFromBusinessWithAlternativePaymentIntention()
    checkAndSendPage.verifyFactsForPartAdmitFromBusiness()
    checkAndSendPage.submitNoDq()
    I.see(testData.claimRef)
    I.see('You’ve proposed a different repayment plan')
    I.click('My account')
    I.see(testData.claimRef)
    I.see('You need to send the defendant’s financial details to the court.')
  })

  Scenario('I can as a claimant accept and suggest an alternative payment intention with instalments @citizen @admissions @business', { retries: 3 }, async (I: I, loginAs) => {
    const testData = await EndToEndTestData.prepareData(I, PartyType.COMPANY, PartyType.INDIVIDUAL)
    testData.defenceType = DefenceType.PART_ADMISSION_NONE_PAID
    testData.paymentOption = PaymentOption.IMMEDIATELY
    const claimantResponseTestData: ClaimantResponseTestData = new ClaimantResponseTestData()
    // as defendant
    await I.loggedInAs(await loginAs('defendant').then(() => 'Defendant'))
    helperSteps.finishResponse(testData, false)
    await I.click('Sign out')
    // as claimant
    await I.loggedInAs(await loginAs('claimant').then(() => 'Claimant'))
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
    I.click('View and respond')
    claimantResponseSteps.acceptFullAdmitFromBusinessWithAlternativePaymentIntention(claimantResponseTestData)
    checkAndSendPage.verifyFactsForPartAdmitFromBusiness()
    checkAndSendPage.submitNoDq()
    I.see(testData.claimRef)
    I.see('You’ve proposed a different repayment plan')
    I.click('My account')
    I.see(testData.claimRef)
    I.see('You need to send the defendant’s financial details to the court.')
  })
}
