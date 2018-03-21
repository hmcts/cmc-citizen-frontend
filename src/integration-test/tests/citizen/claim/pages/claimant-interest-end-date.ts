import I = CodeceptJS.I

const I: I = actor()

const fields = {
  optionSubmission: 'input[id=optionsubmission]',
  optionSettledOrJudgment: 'input[id=optionsettled_or_judgment]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestEndDatePage {

  selectSubmission (): void {
    I.checkOption(fields.optionSubmission)
    I.click(buttons.submit)
  }

  selectSettledOrJudgment (): void {
    I.checkOption(fields.optionSettledOrJudgment)
    I.click(buttons.submit)
  }
}
