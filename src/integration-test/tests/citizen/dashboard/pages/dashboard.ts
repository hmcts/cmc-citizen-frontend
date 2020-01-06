import I = CodeceptJS.I

const I: I = actor()

export class DashboardPage {

  open (): void {
    I.click('My account')
  }

  selectClaim (claimRef: string): void {
    I.click(claimRef)
  }

  logout (): void {
    I.click('Sign out')
  }
}
