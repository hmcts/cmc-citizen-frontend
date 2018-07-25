import I = CodeceptJS.I

import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceType } from 'integration-test/data/defence-type'

const helperSteps: Helper = new Helper()

Feature('Respond to claim: online journey').retry(3)

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

Scenario('I can fill out forms for I admit part of the claim @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = yield I.createClaim(claimData, claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)

  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.INDIVIDUAL, DefenceType.PART_ADMISSION)
})
