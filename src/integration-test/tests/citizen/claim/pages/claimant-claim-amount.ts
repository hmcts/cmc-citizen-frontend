import I = CodeceptJS.I

const I: I = actor()

const fields = {
  reason1: 'input[id="rows[0][reason]"]',
  reason2: 'input[id="rows[1][reason]"]',
  reason3: 'input[id="rows[2][reason]"]',
  amount1: 'input[id="rows[0][amount]"]',
  amount2: 'input[id="rows[1][amount]"]',
  amount3: 'input[id="rows[2][amount]"]',
  calculate: 'input.link-button.calculate',
  totalSum: 'span#totalSum'
}

export class ClaimantClaimAmountPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/amount')
  }

  enterAmount (amount1: number, amount2: number, amount3: number): void {
    I.fillField(fields.reason1, 'Claim value')
    I.fillField(fields.amount1, amount1.toString())
    I.fillField(fields.reason2, 'Cost of legal help')
    I.fillField(fields.amount2, amount2.toString())
    I.fillField(fields.reason3, 'Extra admin fees')
    I.fillField(fields.amount3, amount3.toString())
  }

  getClaimTotal (): void {
    I.grabTextFrom(fields.totalSum)
  }

  continue (): void {
    I.click('Save and continue')
  }
}
