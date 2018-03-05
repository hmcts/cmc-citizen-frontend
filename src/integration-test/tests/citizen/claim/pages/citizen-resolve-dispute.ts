import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class CitizenResolveDisputePage {

  open (): void {
    I.amOnCitizenAppPage('/claim/resolving-this-dispute')
  }

  confirmRead (): void {
    I.click(buttons.submit)
  }
}
