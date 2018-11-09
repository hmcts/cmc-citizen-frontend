import I = CodeceptJS.I
import { createClaimData } from 'integration-test/data/test-data'
import { PartyType } from 'integration-test/data/party-type'
import { PaymentOption } from 'integration-test/data/payment-option'

import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { AppClient } from '../../../helpers/clients/appClient'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()

async function prepareClaim (I: I) {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

  return { data: claimData }
}

const isEnabled = async () => { return AppClient.isFeatureAdmissionsEnabled() }
if (isEnabled) {
  Feature('Partially admit the claim').retry(3)

  Scenario('I can complete the journey when I partially admit the claim with payment already made @citizen @admissions', async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentMade(PartyType.INDIVIDUAL)
  })

  Scenario('I can complete the journey when I partially admit the claim with immediate payment @citizen @admissions', async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
  })

  Scenario('I can complete the journey when I partially admit the claim with by set date payment @citizen @admissions', async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  })

  Scenario('I can complete the journey when I partially admit the claim with instalments payment @citizen @admissions', async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS)
  })
}
