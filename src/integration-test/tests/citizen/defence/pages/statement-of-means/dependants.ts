import I = CodeceptJS.I

const I: I = actor()

const fields = {
  options: {
    declared: 'input[id="declaredtrue"]',
    notDeclared: 'input[id="declaredfalse"]'
  },
  ageGroups: {
    under11: 'input[id="numberOfChildren[under11]"]',
    between11And15: 'input[id="numberOfChildren[between11and15]"]',
    between16And19: 'input[id="numberOfChildren[between16and19]"]'
  }
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class DependantsPage {

  selectDeclared (): void {
    I.checkOption(fields.options.declared)
  }

  selectNotDeclared (): void {
    I.checkOption(fields.options.notDeclared)
  }

  enterNumberOfChildren (numberOfChildrenUnder11: number, numberOfChildrenBetween11And15: number, numberOfChildrenBetween16And19: number): void {
    I.fillField(fields.ageGroups.under11, numberOfChildrenUnder11.toFixed())
    I.fillField(fields.ageGroups.between11And15, numberOfChildrenBetween11And15.toFixed())
    I.fillField(fields.ageGroups.between16And19, numberOfChildrenBetween16And19.toFixed())
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
