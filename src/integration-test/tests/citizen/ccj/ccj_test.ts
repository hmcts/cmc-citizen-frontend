import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { InterestType } from 'integration-test/data/interest-type'
import { createClaimData } from 'integration-test/data/test-data'
import { CountyCourtJudgementSteps } from 'integration-test/tests/citizen/ccj/steps/ccj'

import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const userSteps: UserSteps = new UserSteps()
const ccjSteps: CountyCourtJudgementSteps = new CountyCourtJudgementSteps()

Feature('CCJ')

Scenario('Request judgment as an individual with no defendant email and pay by instalments @citizen @quick', function * (I: I) {
  const email: string = yield I.createCitizenUser()
  const claimantType: PartyType = PartyType.INDIVIDUAL
  const defendantType: PartyType = PartyType.INDIVIDUAL
  const hasDefendantEmail = false

  const claimRef: string = yield I.createClaim(createClaimData(claimantType, defendantType, hasDefendantEmail, InterestType.NO_INTEREST), email)

  userSteps.login(email)
  ccjSteps.requestCCJ(claimRef, defendantType)
  ccjSteps.ccjDefendantToPayByInstalments()
  ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, defendantType)
  I.see('County Court Judgment requested', 'h1.bold-large')
})

Scenario('Request judgment as a Company, pay by set date @citizen', function* (I: I) {

  console.log('Start TESTING`')

  const email: string = yield I.createCitizenUser()
  const claimantType: PartyType = PartyType.COMPANY
  const defendantType: PartyType = PartyType.COMPANY

  console.log('user created, Im a about to create claim')

  const claimRef: string = yield I.createClaim(createClaimData(claimantType, defendantType, true, InterestType.NO_INTEREST), email)

  console.log('claim created')

  userSteps.login(email)
  ccjSteps.requestCCJ(claimRef, defendantType)
  ccjSteps.ccjDefendantToPayBySetDate()
  ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, defendantType)
  I.see('County Court Judgment requested', 'h1.bold-large')
})

Scenario('Request judgment as a sole trader, pay immediately @citizen', function* (I: I) {
  const email: string = yield I.createCitizenUser()
  const claimantType: PartyType = PartyType.SOLE_TRADER
  const defendantType: PartyType = PartyType.ORGANISATION

  const claimRef: string = yield I.createClaim(createClaimData(claimantType, defendantType, true, InterestType.NO_INTEREST), email)

  userSteps.login(email)
  ccjSteps.requestCCJ(claimRef, defendantType)
  ccjSteps.ccjDefendantToPayImmediately()
  ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, defendantType)
  I.see('County Court Judgment requested', 'h1.bold-large')
})
