import I = CodeceptJS.I

const I: I = actor()

const fields = {
  type: 'rows[0][type]',
  description: 'rows[0][description]'
}

const buttons = {
  submit: 'saveAndContinue'
}

export class ClaimantEvidencePage {

  enterEvidenceRow (type: string, description: string): void {
    I.selectOption(fields.type, type)
    I.fillField(fields.description, description)

    I.click(buttons.submit)
  }
}
