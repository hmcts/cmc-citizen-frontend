import I = CodeceptJS.I

const I: I = actor()

const fields = {
  employerName: 'input[id="rows[0][employerName]"]',
  jobTitle: 'input[id="rows[0][jobTitle]"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class EmployersPage {

  enterDetails (employerName: string, jobTitle: string): void {
    I.fillField(fields.employerName, employerName)
    I.fillField(fields.jobTitle, jobTitle)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
