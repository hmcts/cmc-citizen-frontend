import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class AlreadyPaidPage {

  chooseYes (): void {
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.checkOption('No')
    I.click(buttons.submit)
  }

}
