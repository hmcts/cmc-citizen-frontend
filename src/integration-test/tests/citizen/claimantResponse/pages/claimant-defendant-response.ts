import I = CodeceptJS.I

const I: I = actor()

const button = {
  submit: 'input[type=submit]'
}

export class ClaimantDefendantResponsePage {

  submit (): void {
    I.see('The defendant’s response')
    I.click(button.submit)
  }

  submitHowTheyWantToPay (): void {
    I.see('How they want to pay')
    I.click(button.submit)
  }

}
