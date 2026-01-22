import I = CodeceptJS.I

const I: I = actor()

export class ClaimantTaskListPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/task-list')
  }

  selectTaskResolvingThisDispute (): void {
    this.clickTaskLink('a[href="/claim/resolving-this-dispute"]', 'Resolving this dispute')
  }

  selectTaskCompletingYourClaim (): void {
    this.clickTaskLink('a[href="/claim/completing-claim"]', 'Completing your claim')
  }

  selectTaskYourDetails (): void {
    this.clickTaskLink('a[href="/claim/claimant-party-type-selection"]', 'Your details')
  }

  selectTaskTheirDetails (): void {
    this.clickTaskLink('a[href="/claim/defendant-party-type-selection"]', 'Their details')
  }

  selectTaskClaimAmount (): void {
    this.clickTaskLink('a[href="/claim/amount"]', 'Claim amount')
  }

  selectTaskClaimDetails (): void {
    this.clickTaskLink('a[href="/claim/reason"]', 'Claim details')
  }

  selectTaskCheckAndSubmitYourClaim (): void {
    this.clickTaskLink('a[href="/claim/check-and-send"]', 'Check and submit your claim')
  }

  private clickTaskLink (selector: string, fallbackText: string): void {
    const taskSelector = `${selector}, .app-task-list__task-name:contains('${fallbackText}') a`
    if (this.tryClick(taskSelector)) {
      return
    }
    // Fallback to direct text search if the selector isn’t present
    I.click(fallbackText)
  }

  private tryClick (selector: string): boolean {
    try {
      I.waitForElement(selector, 5)
      I.click(selector)
      return true
    } catch (err) {
      return false
    }
  }
}
