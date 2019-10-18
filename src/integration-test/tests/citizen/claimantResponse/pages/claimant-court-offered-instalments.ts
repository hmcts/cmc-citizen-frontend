import I = CodeceptJS.I

const I: I = actor()

const fields = {
  accept: {
    yes: 'input[id=acceptyes]',
    no: 'input[id=acceptno]'
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantCourtOfferedInstalmentsPage {

  accept (): void {
    I.see('The defendant can’t afford your plan')
    I.checkOption(fields.accept.yes)
    I.click(buttons.submit)
  }

  checkingCourtOfferedPlanAndAccept (): void {
    I.see('The defendant can’t afford your plan')
    I.see('The court’s proposed repayment plan')
    I.see('Frequency of payments')
    I.see('Weekly')
    I.checkOption(fields.accept.yes)
    I.click(buttons.submit)
  }

  reject (): void {
    I.see('The defendant can’t afford your plan')
    I.checkOption(fields.accept.no)
    I.click(buttons.submit)
  }

}
