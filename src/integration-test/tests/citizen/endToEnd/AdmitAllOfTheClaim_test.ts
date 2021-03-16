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
let claimRef

Feature('Admit All Of The Claim E2E')

Before(async (I: I) => {
  claimantEmail = await I.getClaimantEmail()
  defendantEmail = await I.getDefendantEmail()

  claimData = await createClaimData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  claimRef = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

})

if (process.env.FEATURE_ADMISSIONS === 'true') {

  Scenario('Admit all of the claim(Pay Immediately) @citizen @nightly @admissions', { retries: 3 }, async (I: I) => {
    defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY, claimData.data.claimants[0].name, false)
  })

  Scenario('Admit all of the claim(Pay By Set Date) @citizen @nightly @admissions', { retries: 3 }, async (I: I) => {
    defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE, claimData.data.claimants[0].name, false)
  })

  Scenario('Admit all of the claim(Pay By Instalment) with PCQ @citizen @admissions', { retries: 3 }, async (I: I) => {
    defenceSteps.makeFullAdmission(claimData.data.defendants[0], PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS, claimData.data.claimants[0].name, false, true)
  })
}
