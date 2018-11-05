import I = CodeceptJS.I
import { createClaimData } from 'integration-test/data/test-data'
import { PartyType } from 'integration-test/data/party-type'
import { PaymentOption } from 'integration-test/data/payment-option'

import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()

Feature('Partially admit the claim').retry(3)

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

Scenario('I can complete the journey when I partially admit the claim with payment already made @citizen @admissions @debug11', async (I: I) => {
  const claimData = await prepareClaim(I)
  defenceSteps.makePartialAdmission(claimData.data.defendants[0])
  if (claimData.isAdmissionsOn) {
    I.see('Post your response')
  } else {
    defenceSteps.partialPaymentMade(PartyType.INDIVIDUAL)
  }
})

Scenario('I can complete the journey when I partially admit the claim with immediate payment @citizen @admissions', async (I: I) => {
  const claimData = await prepareClaim(I)
  defenceSteps.makePartialAdmission(claimData.data.defendants[0])
  if (claimData.isAdmissionsOn) {
    I.see('Post your response')
  } else {
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
  }
})

Scenario('I can complete the journey when I partially admit the claim with by set date payment @citizen @admissions', async (I: I) => {
  const claimData = await prepareClaim(I)
  defenceSteps.makePartialAdmission(claimData.data.defendants[0])
  if (claimData.isAdmissionsOn) {
    I.see('Post your response')
  } else {
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  }
})

Scenario('I can complete the journey when I partially admit the claim with instalments payment @citizen @admissions', async (I: I) => {
  const claimData = await prepareClaim(I)
  defenceSteps.makePartialAdmission(claimData.data.defendants[0])
  if (claimData.isAdmissionsOn) {
    I.see('Post your response')
  } else {
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS)
  }
})
