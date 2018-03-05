import I = CodeceptJS.I

const I: I = actor()

const fields = {
  name: 'input[id=name]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class CitizenNamePage {

  open (type: string): void {
    I.amOnCitizenAppPage(`/claim/${type}-name`)
  }

  enterName (name: string): void {
    I.fillField(fields.name, name)
    I.click(buttons.submit)
  }
}
