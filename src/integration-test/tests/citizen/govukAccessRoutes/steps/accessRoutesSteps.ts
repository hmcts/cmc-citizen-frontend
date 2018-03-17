import I = CodeceptJS.I

const I: I = actor()
const returnToClaimPage = '/return-to-claim'

const fields = {
  reference: 'input[id=reference]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class AccessRoutesSteps {
  returnToClaimMcol (): void {
    I.amOnPage(returnToClaimPage)
    I.fillField(fields.reference, 'AA12321321')
    I.click(buttons.submit)
    I.see('Money Claim Online')
  }

  returnToClaimMoneyClaims (reference: string, username: string): void {

  }

  dontHaveAReferenceMcol (): void {

  }

  dontHaveAReferenceMoneyClaims (username: string): void {

  }

  respondToClaimMcol (): void {

  }

  respondToClaimMoneyClaims (referenceNumber: string): void {

  }
}
