import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { PaymentOption } from 'integration-test/data/payment-option'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { DefenceType } from '../../../data/defence-type'
import { ClaimantResponseTestData } from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const claimantResponseTestData: ClaimantResponseTestData = new ClaimantResponseTestData()

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Feature('Claimant Response ::: Full admit when defendant is business').retry(3)

  Scenario('I can as a claimant accept and suggest an alternative payment intention @citizen @admissions @business', async (I: I) => {
    const testData = await EndToEndTestData.prepareData(I, PartyType.COMPANY, PartyType.INDIVIDUAL)
    testData.defenceType = DefenceType.PART_ADMISSION_NONE_PAID
    testData.paymentOption = PaymentOption.INSTALMENTS
    // as defendant
    helperSteps.finishResponse(testData, false)
    I.click('Sign out')
    // as claimant
    userSteps.login(testData.claimantEmail)
    claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
    I.click('View and respond')
    claimantResponseSteps.acceptFullAdmitFromBusinessWithAlternativePaymentIntention(claimantResponseTestData)
    checkAndSendPage.verifyFactsForPartAdmitFromBusiness()
    checkAndSendPage.checkFactsTrueAndSubmit()
    I.see(testData.claimRef)
    I.see('You’ve proposed a different repayment plan')
    I.click('My account')
    I.see(testData.claimRef)
    I.see('You need to send the defendant’s financial details to the court.')
  })
}
