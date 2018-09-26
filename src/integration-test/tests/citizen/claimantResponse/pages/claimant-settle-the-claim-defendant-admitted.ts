import I = CodeceptJS.I

const I: I = actor()

const fields = {
  yes: 'input[id=admittedyes]',
  no: 'input[id=admittedno]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantSettleTheClaimDefendantAdmittedPage {

  selectAdmittedYes (): void {
    I.checkOption(fields.yes)
    I.click(buttons.submit)
  }

  selectAdmittedNo (): void {
    I.checkOption(fields.no)
    I.click(buttons.submit)
  }
}
