import { claimAmount } from 'integration-tests/data/test-data'
import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'a.button'
}

export class PaidAmountSummaryPage {

  // to be used in the future.
  checkAmounts (defendantPaidAmount: number): void {
    I.see('Amount to be paid by defendant')
    I.see('Minus amount already paid £' + defendantPaidAmount.toFixed(2))
    const amountOutstanding: number = claimAmount.getTotal() - defendantPaidAmount
    I.see('Total £' + amountOutstanding.toFixed(2))
  }

  continue (): void {
    I.click(buttons.submit)
  }
}
