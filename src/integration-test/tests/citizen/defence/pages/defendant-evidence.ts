import I = CodeceptJS.I

const I: I = actor()

const fields = {
  type: 'rows[0][type]',
  description: 'rows[0][description]',
  comment: 'comment'
}

const buttons = {
  submit: 'saveAndContinue'
}

export class DefendantEvidencePage {

  enterEvidenceRow (type: string, description: string, comment: string): void {
    I.selectOption(fields.type, type)
    I.fillField(fields.description, description)
    I.fillField(fields.comment, comment)

    I.click(buttons.submit)
  }
}
