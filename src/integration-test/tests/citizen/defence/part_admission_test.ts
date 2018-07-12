import I = CodeceptJS.I
import { createClaimData } from 'integration-test/data/test-data'
import { PartyType } from 'integration-test/data/party-type'

import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()

Feature('Partially admit the claim')

Before(function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)
})

Scenario('I can complete the journey when I partially admit the claim with payment already made @citizen', function* (I: I) {
  defenceSteps.makePartialAdmission(PartyType.INDIVIDUAL, YesNoOption.YES)
})
