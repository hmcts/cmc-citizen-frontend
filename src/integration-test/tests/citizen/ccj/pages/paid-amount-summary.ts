import { claimAmount } from 'integration-test/data/test-data'
import I = CodeceptJS.I
import { AmountHelper } from 'integration-test/helpers/amountHelper'

const I: I = actor()

const buttons = {
  submit: 'a.button'
}

export class PaidAmountSummaryPage {

  // to be used in the future.
  checkAmounts (defendantPaidAmount: number): void {
    I.see('Judgment amount')
    const amountOutstanding: number = claimAmount.getTotal() - defendantPaidAmount
    I.see('Total ' + AmountHelper.formatMoney(amountOutstanding))
  }

  continue (): void {
    I.click(buttons.submit)
  }
}
