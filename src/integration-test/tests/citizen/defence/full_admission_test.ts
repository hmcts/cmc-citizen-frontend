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

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)
}

Scenario('I can complete the journey when I fully admit all of the claim with immediate payment @citizen', async (I: I) => {
  await prepareClaim(I)

  defenceSteps.makeFullAdmission(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
})

Scenario('I can complete the journey when I fully admit all of the claim with full payment by set date @citizen', async (I: I) => {
  await prepareClaim(I)

  defenceSteps.makeFullAdmission(PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
})

Scenario('I can complete the journey when I fully admit all of the claim with full payment by instalments @citizen', async (I: I) => {
  await prepareClaim(I)

  defenceSteps.makeFullAdmission(PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS)
})
