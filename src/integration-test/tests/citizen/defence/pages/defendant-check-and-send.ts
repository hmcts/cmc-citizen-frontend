import I = CodeceptJS.I
import { DefenceType } from 'integration-test/data/defence-type'

const I: I = actor()

const fields = {
  checkboxFactsTrue: { css: 'input#signedtrue' },
  checkboxHearingRequirementsTrue: { css: 'input#directionsQuestionnaireSignedtrue' },
  signerName: { css: 'input[id=signerName]' },
  signerRole: { css: 'input[id=signerRole]' }
}

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class DefendantCheckAndSendPage {

  signStatementOfTruthAndSubmit (signerName: string, signerRole: string, defenceType: DefenceType): void {
    I.fillField(fields.signerName, signerName)
    I.fillField(fields.signerRole, signerRole)
    this.checkFactsTrueAndSubmit(defenceType)
  }

  checkFactsTrueAndSubmit (defenceType: DefenceType): void {
    I.checkOption(fields.checkboxFactsTrue)
    if (defenceType !== DefenceType.FULL_ADMISSION && process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
      I.checkOption(fields.checkboxHearingRequirementsTrue)
    }
    I.click(buttons.submit)
  }

  verifyFactsPartialResponseClaimAmountTooMuch (): void {
    I.waitForText('I reject part of the claim')
    I.see('The claim amount is too much')
    I.see('How much money do you believe you owe?')
    I.see('Why this is what you owe?')
    I.see('Your timeline of events (optional)')
    I.see('Your evidence (optional)')
    I.see('Free telephone mediation')
  }

  verifyFactsPartialResponseIBelieveIPaidWhatIOwe (): void {
    I.waitForText('I reject part of the claim')
    I.see('I’ve paid what I believe I owe')
    I.see('How much have you paid the claimant?')
    I.see('When did you pay this amount?')
    I.see('Explain why you don’t owe the full amount')
    I.see('Your timeline of events (optional)')
    I.see('Your evidence (optional)')
    I.see('Free telephone mediation')
  }

}
