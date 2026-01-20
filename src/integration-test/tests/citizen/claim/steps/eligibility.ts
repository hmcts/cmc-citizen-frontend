import I = CodeceptJS.I

const I: I = actor()

function completeEligibilityPage (optionSelector: string) {
  I.checkOption(optionSelector)
  I.click('input[type=submit]')
}

export class EligibilitySteps {

  async complete (): Promise<void> {
    I.amOnCitizenAppPage('/eligibility')
    await this.acceptCookieBanner()
    await this.assertEligibilityHeading()
    I.click('Continue')

    completeEligibilityPage('input[id=claimValueUNDER_10000]')
    completeEligibilityPage('input[id=singleDefendantno]')
    completeEligibilityPage('input[id=defendantAddressyes]')
    completeEligibilityPage('input[id=claimTypePERSONAL_CLAIM]')
    completeEligibilityPage('input[id=claimantAddressyes]')
    completeEligibilityPage('input[id=claimIsForTenancyDepositno]')
    completeEligibilityPage('input[id=governmentDepartmentno]')
    completeEligibilityPage('input[id=defendantAgeyes] ')
    completeEligibilityPage('input[id=eighteenOrOveryes] ')
    completeEligibilityPage('input[id=helpWithFeesno]')

    I.see('You can use this service')
    I.click('Continue')

  }

  private async acceptCookieBanner (): Promise<void> {
    const acceptButtonSelector = '.cookie-banner-accept-button'
    const visibleButtons = await I.grabNumberOfVisibleElements(acceptButtonSelector)

    if (visibleButtons > 0) {
      I.click(acceptButtonSelector)
      const hideButtonSelector = '.cookie-banner-hide-button'
      const hideButtons = await I.grabNumberOfVisibleElements(hideButtonSelector)
      if (hideButtons > 0) {
        I.click(hideButtonSelector)
      }
      I.waitForInvisible('.cookie-banner', 5)
    }
  }

  private async assertEligibilityHeading (): Promise<void> {
    const registeredHeading = 'Find out if you can make a claim using this service'
    const betaHeading = 'Try the new online service'

    await I.waitForElement('h1', 5)
    const headingText = await I.grabTextFrom('h1')
    if (!headingText.includes(registeredHeading) && !headingText.includes(betaHeading)) {
      throw new Error(`Unexpected eligibility heading: ${headingText}`)
    }
  }
}
