import I = CodeceptJS.I
import { createClaimData } from 'integration-test/data/test-data'
import { PartyType } from 'integration-test/data/party-type'
import { PaymentOption } from 'integration-test/data/payment-option'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()

async function prepareClaim (I: I) {
  const claimantEmail: string = await I.getClaimantEmail()
  const defendantEmail: string = await I.getDefendantEmail()

  const claimData: ClaimData = await createClaimData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

  return { data: claimData }
}

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Feature('Partially admit the claim')

  Scenario('I can complete the journey when I partially admit the claim with payment already made @citizen @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentMade(PartyType.INDIVIDUAL)
  })

  Scenario('I can complete the journey when I partially admit the claim with immediate payment @nightly @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
  })

  Scenario('I can complete the journey when I partially admit the claim with by set date payment @citizen @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  })

  Scenario('I can complete the journey when I partially admit the claim with instalments payment @nightly @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS)
  })
}
