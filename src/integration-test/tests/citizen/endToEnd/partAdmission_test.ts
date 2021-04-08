import I = CodeceptJS.I
import { createClaimData } from 'integration-test/data/test-data'
import { PartyType } from 'integration-test/data/party-type'
import { PaymentOption } from 'integration-test/data/payment-option'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()
let claimantEmail
let defendantEmail
let claimData
let defendant
let claimRef

Feature('Admit part of the claim E2E')

Before(async (I: I) => {
  claimantEmail = await I.getClaimantEmail()
  defendantEmail = await I.getDefendantEmail()

  claimData = await createClaimData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  defendant = claimData.defendants[0]
  claimRef = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

})

if (process.env.FEATURE_ADMISSIONS === 'true') {

  Scenario('Admit part of the claim with payment already made @citizen @admissions', { retries: 3 }, async (I: I) => {
    defenceSteps.makePartialAdmission(defendant)
    await defenceSteps.partialPaymentMade(PartyType.INDIVIDUAL)
  })

  Scenario('Admit part of the claim (Pay Immediately) @nightly @admissions', { retries: 3 }, async (I: I) => {
    defenceSteps.makePartialAdmission(defendant)
    await defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
  })

  Scenario('Admit part of the claim (Pay By Set Date) @citizen @admissions', { retries: 3 }, async (I: I) => {
    defenceSteps.makePartialAdmission(defendant)
    await defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  })

  Scenario('Admit part of the claim (Pay By Instalment) @nightly @admissions', { retries: 3 }, async (I: I) => {
    defenceSteps.makePartialAdmission(defendant)
    await defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS)
  })
}
