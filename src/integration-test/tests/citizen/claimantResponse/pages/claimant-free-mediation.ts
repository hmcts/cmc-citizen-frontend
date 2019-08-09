import I = CodeceptJS.I

const I: I = actor()

const fields = {
  wantFreeMediation: {
    yes: 'input[id=optionyes]',
    no: 'input[id=optionno]'
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantFreeMediationPage {

  accept (): void {
    I.see('Free telephone mediation')
    I.checkOption(fields.wantFreeMediation.yes)
    I.click(buttons.submit)
  }

  reject (): void {
    I.see('Free telephone mediation')
    I.checkOption(fields.wantFreeMediation.no)
    I.click(buttons.submit)
  }

}
