import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import I = CodeceptJS.I

const helperSteps: Helper = new Helper()

Feature('E2E tests for Claim and Defence response').retry(3)

// Warning : Changing the text description of this scenario, could cause failure when running ZAP security test
Scenario('I can as an Individual make a claim against an Individual Without a defendant email address and are able to pay on the Gov Pay page @citizen', async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimRef: string = await I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, false), claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.INDIVIDUAL)
})

Scenario('I can as Sole Trader make a claim against an Individual and are able to pay on the Gov Pay page @citizen', async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail = await I.createCitizenUser()

  const claimRef = await I.createClaim(createClaimData(PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.INDIVIDUAL)
})

Scenario('I can as a Company make a claim against an Individual and are able to pay on the Gov Pay page @citizen', async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimRef: string = await I.createClaim(createClaimData(PartyType.COMPANY, PartyType.INDIVIDUAL), claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.INDIVIDUAL)
})

Scenario('I can as a Individual make a claim against a Company and are able to pay on the Gov Pay page @citizen @quick', async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimRef: string = await I.createClaim(createClaimData(PartyType.INDIVIDUAL, PartyType.COMPANY), claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.COMPANY)
})

Scenario('I can as a Company make a claim against a company and are able to pay on the Gov Pay page @citizen', async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimRef: string = await I.createClaim(createClaimData(PartyType.COMPANY, PartyType.COMPANY), claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.COMPANY)
})

Scenario('I can as a Organisation make a claim against an Individual and are able to pay on the Gov Pay page @citizen', async (I: I) => {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()

  const claimRef: string = await I.createClaim(createClaimData(PartyType.ORGANISATION, PartyType.INDIVIDUAL), claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.finishResponse(claimRef, defendantEmail, PartyType.INDIVIDUAL)
})
