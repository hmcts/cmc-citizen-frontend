import I = CodeceptJS.I

const I: I = actor()

const submitResponseButton = {
  submit: 'input[type=submit]'
}

export class ClaimantCheckYourAnswersPage {

  submitResponse (): void {
    I.click(submitResponseButton.submit)
  }

  verifyClaimantResponseToAcceptingPartAdmissionImmediatelyOffer (): void {
    I.see('Do you accept or reject the defendant’s admission?')
    I.see('I accept this amount')
  }

  verifyClaimantResponseToRejectingPartAdmissionImmediatelyOffer (): void {
    I.see('Do you accept or reject the defendant’s admission?')
    I.see('I reject this amount')
  }

}
