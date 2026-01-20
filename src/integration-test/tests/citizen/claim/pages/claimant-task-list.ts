import I = CodeceptJS.I

const I: I = actor()

export class ClaimantTaskListPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/task-list')
  }

  selectTaskResolvingThisDispute (): void {
    const selector = 'a[href="/claim/resolving-this-dispute"]'
    I.waitForElement(selector, 10)
    I.click(selector)
  }

  selectTaskCompletingYourClaim (): void {
    const selector = 'a[href="/claim/completing-claim"]'
    I.waitForElement(selector, 10)
    I.click(selector)
  }

  selectTaskYourDetails (): void {
    const selector = 'a[href="/claim/claimant-party-type-selection"]'
    I.waitForElement(selector, 10)
    I.click(selector)
  }

  selectTaskTheirDetails (): void {
    const selector = 'a[href="/claim/defendant-party-type-selection"]'
    I.waitForElement(selector, 10)
    I.click(selector)
  }

  selectTaskClaimAmount (): void {
    const selector = 'a[href="/claim/amount"]'
    I.waitForElement(selector, 10)
    I.click(selector)
  }

  selectTaskClaimDetails (): void {
    const selector = 'a[href="/claim/reason"]'
    I.waitForElement(selector, 10)
    I.click(selector)
  }

  selectTaskCheckAndSubmitYourClaim (): void {
    const selector = 'a[href="/claim/check-and-send"]'
    I.waitForElement(selector, 10)
    I.click(selector)
  }
}
