import I = CodeceptJS.I

const I: I = actor()

const fields = {
  text: 'textarea[id=text]'
}

export class CannotPayImmediatelyPage {

  enterExplaination (): void {
    I.fillField(fields.text, 'I cannot pay immediately')
  }
}
