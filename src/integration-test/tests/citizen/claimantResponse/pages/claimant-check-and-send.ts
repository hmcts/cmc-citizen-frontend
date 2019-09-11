import I = CodeceptJS.I
import { DefenceType } from 'integration-test/data/defence-type'

const I: I = actor()

const fields = {
  checkboxFactsTrue: 'input#signedtrue',
  signerName: 'input[id=signerName]',
  signerRole: 'input[id=signerRole]',
  checkboxHearingRequirementsTrue: 'input#directionsQuestionnaireSignedtrue'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantCheckAndSendPage {

  signStatementOfTruthAndSubmit (signerName: string, signerRole: string, defenceType: DefenceType): void {
    I.fillField(fields.signerName, signerName)
    I.fillField(fields.signerRole, signerRole)
    this.checkFactsTrueAndSubmit(defenceType)
  }

  checkFactsTrueAndSubmit (defenceType: DefenceType): void {
    if (defenceType !== DefenceType.FULL_ADMISSION && process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
      I.checkOption(fields.checkboxHearingRequirementsTrue)
    }
    I.click(buttons.submit)
  }

  checkFactsTrueAndSubmitNoDq (): void {
    I.click(buttons.submit)
  }

  verifyFactsForPartAdmitRejection (): void {
    I.see('Your response')
    I.see('Do you accept or reject the defendant’s admission?')
    I.see('I reject this amount')
  }

  verifyFactsForSettlement (): void {
    I.see('Your response')
    I.see('Do you accept the defendant’s repayment plan?')
    I.see('How you wish to proceed')
    I.see('How do you want to formalise the repayment plan?')
  }

  verifyFactsForCCJ (): void {
    I.see('Your response')
    I.see('Do you accept the defendant’s repayment plan?')
    I.see('How you wish to proceed')
    I.see('How do you want to formalise the repayment plan?')
    I.see('Judgment request')
    I.see('Has the defendant paid some of the amount owed?')
    I.see('Total to be paid by defendant')
  }

  verifyFactsForPartAdmitFromBusiness (): void {
    I.see('Your response')
    I.see('Do you accept or reject the defendant’s admission?')
    I.see('Do you accept the defendant’s repayment plan?')
    I.see('How would you like the defendant to pay?')
  }
}
