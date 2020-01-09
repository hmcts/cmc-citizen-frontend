import I = CodeceptJS.I
import { DefenceType } from '../../../../data/defence-type'

const I: I = actor()

const fields = {
  linkGoToYourAccount: 'a[href="/dashboard"]'
}

export class ClaimantConfirmation {

  clickGoToYourAccount (): void {
    I.click(fields.linkGoToYourAccount)
  }

  verifyAcceptanceConfirmation (): void {
    I.see('You’ve accepted their response')
  }

  verifyRejectionConfirmation (defenceType: DefenceType): void {
    I.see('You’ve rejected their response')
    if (defenceType !== DefenceType.FULL_ADMISSION && process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
      I.see('Download your hearing requirements')
    }
  }

  verifyAcceptanceSettlementConfirmation (): void {
    I.see('You’ve signed a settlement agreement')
  }

  verifyCCJConfirmation (): void {
    I.see('County Court Judgment requested')
  }

  verifyCourtRepaymentPlanConfirmation (): void {
    I.see('You’ve accepted the repayment plan')
  }
}
