import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantDefendantTypePage {

  open (): void {
    I.amOnCitizenAppPage('/claim/defendant-type')
  }

  chooseIndividual (): void {
    I.checkOption('Individual')
    I.click(buttons.submit)
  }
}
