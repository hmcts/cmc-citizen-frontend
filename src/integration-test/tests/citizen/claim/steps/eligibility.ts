import I = CodeceptJS.I

const I: I = actor()

function completeEligibilityPage (optionSelector: string) {
  I.checkOption(optionSelector)
  I.click('input[type=submit]')
}

export class EligibilitySteps {

  complete (): void {
    I.amOnCitizenAppPage('/eligibility')

    I.see('Find out if you can make a claim using this service')
    I.click('Continue')

    completeEligibilityPage('input[id=claimValueUNDER_10000]')
    completeEligibilityPage('input[id=helpWithFeesno]')
    completeEligibilityPage('input[id=singleDefendantno]')
    completeEligibilityPage('input[id=defendantAddressyes]')
    completeEligibilityPage('input[id=claimTypePERSONAL_CLAIM]')
    completeEligibilityPage('input[id=claimantAddressyes]')
    completeEligibilityPage('input[id=claimIsForTenancyDepositno]')
    completeEligibilityPage('input[id=governmentDepartmentno]')
    completeEligibilityPage('input[id=defendantAgeyes] ')
    completeEligibilityPage('input[id=eighteenOrOveryes] ')

    I.see('You can use this service')
    I.click('Continue')

  }
}
