import { PartyType } from 'integration-test/data/party-type'
import { claimAmount, createClaimData, createDefendant } from 'integration-test/data/test-data'
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import I = CodeceptJS.I
import { AmountHelper } from 'integration-test/helpers/amountHelper'
import { DashboardClaimDetails } from 'integration-test/tests/citizen/defence/pages/defendant-claim-details'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { PaymentOption } from 'integration-test/data/payment-option'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { ClaimantConfirmation } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-confirmation'
import { PaidInFullSteps } from 'integration-test/tests/citizen/dashboard/steps/paid-in-full'
import { InterestType } from 'integration-test/data/interest-type'
import { CountyCourtJudgementSteps } from 'integration-test/tests/citizen/ccj/steps/ccj'

const claimSteps: ClaimSteps = new ClaimSteps()
const paidInFullSteps: PaidInFullSteps = new PaidInFullSteps()
const dashboardClaimDetails: DashboardClaimDetails = new DashboardClaimDetails()
const ccjSteps: CountyCourtJudgementSteps = new CountyCourtJudgementSteps()

Feature('Dashboard').retry(3)

Scenario('Check newly created claim is in my account dashboard with correct claim amount @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()
  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await claimSteps.makeAClaimAndSubmit(email, PartyType.COMPANY, PartyType.INDIVIDUAL, false)

  I.click('My account')
  I.see('Your money claims account')
  I.see(claimRef + ' ' + createDefendant(PartyType.INDIVIDUAL).name + ' ' + AmountHelper.formatMoney(claimAmount.getTotal()))
  I.click(claimRef)
  I.see('Claim number:')
  I.see(claimRef)
  I.see('Claim status')
  dashboardClaimDetails.clickViewClaim()
  dashboardClaimDetails.checkClaimData(claimRef, claimData)
})

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const confirmationPage: ClaimantConfirmation = new ClaimantConfirmation()
const claimantType: PartyType = PartyType.COMPANY
const defendantType: PartyType = PartyType.COMPANY

Feature('Paid In Full')

Scenario('Claimant is telling us defendant has paid in full. NO CCJ has been requested @citizen', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  // as defendant
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef, false)
  I.click('Tell us you’ve settled')
  paidInFullSteps.inputDatePaid('2017-01-01')
  I.see('The claim is now settled')
  confirmationPage.clickGoToYourAccount()
  I.click(testData.claimRef)
  I.see('This claim is settled')
  I.see(createDefendant(PartyType.INDIVIDUAL).name + ' paid you ' + AmountHelper.formatMoney(claimAmount.getTotal())
    + ' on 1 January 2017.')
})

Scenario('Claimant is telling us defendant has paid in full. CCJ has been requested within 1 month @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()
  const claimRef: string = await I.createClaim(createClaimData(claimantType, defendantType, true, InterestType.NO_INTEREST), email)

  userSteps.login(email)
  ccjSteps.requestCCJ(claimRef, defendantType)
  ccjSteps.ccjDefendantToPayBySetDate()
  ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, defendantType)
  confirmationPage.clickGoToYourAccount()
  I.click(claimRef)
  I.click('you need to tell us')
  paidInFullSteps.inputDatePaid('2017-01-01')
  I.see('The claim is now settled')
  confirmationPage.clickGoToYourAccount()
  I.click(claimRef)
  I.see('This claim is settled')
  I.see(createDefendant(PartyType.COMPANY).name + ' paid you ' + AmountHelper.formatMoney(claimAmount.getTotal())
    + ' on 1 January 2017.')
  I.see('The defendant’s County Court Judgment has been cancelled.')
})
