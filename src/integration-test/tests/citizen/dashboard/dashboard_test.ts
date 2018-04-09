import { PartyType } from 'integration-test/data/party-type'
import { claimAmount, createDefendant } from 'integration-test/data/test-data'
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import I = CodeceptJS.I
import { AmountHelper } from 'integration-test/helpers/amountHelper'

const claimSteps: ClaimSteps = new ClaimSteps()

Scenario('Check newly created claim is in my account dashboard with correct claim amount @citizen', function* (I: I) {
  const email: string = yield I.createCitizenUser()

  const claimRef: string = yield claimSteps.makeAClaimAndSubmit(email, PartyType.COMPANY, PartyType.INDIVIDUAL, false)

  I.click('My account')
  I.see('Your money claims account')
  I.see(claimRef + ' ' + createDefendant(PartyType.INDIVIDUAL).name + ' ' + AmountHelper.formatMoney(claimAmount.getTotal()))
})
