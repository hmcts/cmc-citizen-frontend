import I = CodeceptJS.I

import { createClaimData } from 'integration-test/data/test-data'
import { PartyType } from 'integration-test/data/party-type'
import { PaymentOption } from 'integration-test/data/payment-option'

import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()

Feature('Fully admit all of the claim').retry(3)

async function prepareClaim (I: I) {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  const isAdmissionsOn: boolean = await I.isAdmissionsAllowedForCitizenWithConsentGiven({ email: defendantEmail, bearerToken: '' })

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

  return { data: claimData, isAdmissionsOn: isAdmissionsOn }
}

Scenario('I can complete the journey when I fully admit all of the claim with immediate payment @citizen @admissions', async (I: I) => {
  const claimData = await prepareClaim(I)
  defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY, claimData.data.claimants[0].name, claimData.isAdmissionsOn)
})

Scenario('I can complete the journey when I fully admit all of the claim with full payment by set date @citizen @admissions', async (I: I) => {
  const claimData = await prepareClaim(I)
  defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE, claimData.data.claimants[0].name, claimData.isAdmissionsOn)
})

Scenario('I can complete the journey when I fully admit all of the claim with full payment by instalments @citizen @admissions', async (I: I) => {
  const claimData = await prepareClaim(I)
  defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS, claimData.data.claimants[0].name, claimData.isAdmissionsOn)
})
