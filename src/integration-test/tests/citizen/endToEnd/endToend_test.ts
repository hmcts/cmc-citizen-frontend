import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import I = CodeceptJS.I

const helperSteps: Helper = new Helper()

Feature('E2E tests for Claim and Defence response')

// Warning : Changing the text description of this scenario, could cause failure when running ZAP security test
Scenario('I can as an Individual make a claim against an Individual Without a defendant email address and are able to pay on the Gov Pay page @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimRef: string = yield I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, false), claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(defendantEmail, PartyType.INDIVIDUAL)
})

Scenario('I can as Sole Trader make a claim against an Individual and are able to pay on the Gov Pay page @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail = yield I.createCitizenUser()

  const claimRef = yield I.createClaim(createClaimData(PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(defendantEmail, PartyType.INDIVIDUAL)
})

Scenario('I can as a Company make a claim against an Individual and are able to pay on the Gov Pay page @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimRef: string = yield I.createClaim(createClaimData(PartyType.COMPANY, PartyType.INDIVIDUAL), claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(defendantEmail, PartyType.INDIVIDUAL)
})

Scenario('I can as a Individual make a claim against a Company and are able to pay on the Gov Pay page @citizen @quick', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimRef: string = yield I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.COMPANY), claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(defendantEmail, PartyType.COMPANY)
})

Scenario('I can as a Company make a claim against a company and are able to pay on the Gov Pay page @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimRef: string = yield I.createClaim(createClaimData(PartyType.COMPANY, PartyType.COMPANY), claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(defendantEmail, PartyType.COMPANY)
})

Scenario('I can as a Organisation make a claim against an Individual and are able to pay on the Gov Pay page @citizen', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const defendantEmail: string = yield I.createCitizenUser()

  const claimRef: string = yield I.createClaim(createClaimData(PartyType.ORGANISATION, PartyType.INDIVIDUAL), claimantEmail)

  yield helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(defendantEmail, PartyType.INDIVIDUAL)
})
