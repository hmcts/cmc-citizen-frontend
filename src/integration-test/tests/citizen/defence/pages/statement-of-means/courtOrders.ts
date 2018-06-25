import I = CodeceptJS.I

const I: I = actor()

const fields = {
  dontHaveCourtOrders: 'input[id="hasAnyCourtOrdersfalse"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class CourtOrdersPage {

  selectDontHaveCourtOrders (): void {
    I.checkOption(fields.dontHaveCourtOrders)
    I.click(buttons.submit)
  }
}
