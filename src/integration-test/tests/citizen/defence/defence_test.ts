import { PartyType } from 'integration-test/data/party-type'
import { InterestType } from 'integration-test/data/interest-type'
import { PaymentOption } from 'integration-test/data/payment-option'
import { createClaimData, dailyInterestAmount } from 'integration-test/data/test-data'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import I = CodeceptJS.I
import { DefenceType } from 'integration-test/data/defence-type'
import { DashboardClaimDetails } from 'integration-test/tests/citizen/defence/pages/defendant-claim-details'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()
const defendantDetails: DashboardClaimDetails = new DashboardClaimDetails()

Feature('Respond to claim')

Scenario('I can complete the journey when I fully reject the claim as I dispute the claim @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimRef: string = yield I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL), claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.INDIVIDUAL, DefenceType.FULL_REJECTION_WITH_DISPUTE)
})

Scenario('I can complete the journey when I fully reject the claim as I have already paid @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()
  const claimModel: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)

  const claimRef: string = yield I.createClaim(claimModel, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.INDIVIDUAL, DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID)

  I.click('My account')
  I.see(claimRef)
  I.see(`We’ve emailed ${claimModel.claimants[0].name} telling them when and how you said you paid the claim`)
})

Scenario('I can complete the journey when I fully admit all of the claim with immediate payment @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

  defenceSteps.makeFullAdmission(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
})

Scenario('I can complete the journey when I fully admit all of the claim with full payment by set date @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

  defenceSteps.makeFullAdmission(PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
})

Scenario('I can complete the journey when I fully admit all of the claim with full payment by instalments @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

  defenceSteps.makeFullAdmission(PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS)
})

Scenario('I can see send your response by email page when I admit part of the claim @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const defendant: Party = claimData.defendants[0]
  const claimant: Party = claimData.claimants[0]

  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, DefenceType.PART_ADMISSION)
})

Scenario('I can see send your response by email page when I reject all of the claim with counter claim @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const defendant: Party = claimData.defendants[0]
  const claimant: Party = claimData.claimants[0]

  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, DefenceType.FULL_REJECTION_WITH_COUNTER_CLAIM)
})

Scenario('I can see send your response by email page when I reject all of the claim with amount paid less than claimed amount @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const defendant: Party = claimData.defendants[0]
  const claimant: Party = claimData.claimants[0]

  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponseWithHandOff(claimRef, defendant, claimant,
    defendantEmail, DefenceType.FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT
  )
})

Scenario('I can view the claim details from a link on the dashboard @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.defendantViewCaseTaskList(defendantEmail)
  I.click(claimRef)
  I.click('Respond to claim')
  defendantDetails.clickViewClaim()
  defendantDetails.checkClaimData(claimRef, claimData)
})

Scenario('I can view the claim details from a link on the dashboard for interest breakdown @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, true, InterestType.BREAKDOWN)
  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.defendantViewCaseTaskList(defendantEmail)
  I.click(claimRef)
  I.click('Respond to claim')
  defendantDetails.clickViewClaim()
  defendantDetails.checkClaimData(claimRef, claimData)
  I.see('Interest calculated with daily interest amount of £' + dailyInterestAmount + ' for 0 days')
})
