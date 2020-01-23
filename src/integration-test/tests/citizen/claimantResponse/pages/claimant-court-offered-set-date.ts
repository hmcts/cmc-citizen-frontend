import I = CodeceptJS.I

const I: I = actor()

const fields = {
  acceptCourtCalculator: {
    yes: 'input[id=acceptyes]',
    no: 'input[id=acceptno]'
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantCourtOfferedSetDatePage {

  accept (): void {
    I.checkOption(fields.acceptCourtCalculator.yes)
    I.click(buttons.submit)
  }

  reject (): void {
    I.checkOption(fields.acceptCourtCalculator.no)
    I.click(buttons.submit)
  }

}
