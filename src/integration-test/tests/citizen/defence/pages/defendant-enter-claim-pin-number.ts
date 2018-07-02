import I = CodeceptJS.I

const I: I = actor()

const fields = {
  tacticalPinNumber: 'input#pinnumber',
  strategicPinNumber: 'input#pin'
}

const buttons = {
  submit: 'input[type=submit]'
}

const idamUrl: string = process.env.IDAM_URL

const strategicIdam: boolean = idamUrl.includes('core-compute') ||
  idamUrl.includes('platform.hmcts.net')

export class DefendantEnterClaimPinNumberPage {

  enterPinNumber (pinNumber: string): void {
    if (strategicIdam) {
      I.fillField(fields.strategicPinNumber, pinNumber)
    } else {
      I.fillField(fields.tacticalPinNumber, pinNumber)
    }

    I.click(buttons.submit)
  }
}
