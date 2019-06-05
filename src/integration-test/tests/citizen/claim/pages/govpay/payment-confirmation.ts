import I = CodeceptJS.I

const I: I = actor()

const links = {
  goBack: '#return-url'
}

const buttons = {
  confirm: '//*[@id="confirm"]'
}

export class PaymentConfirmationPage {

  confirmPayment (): void {
    I.waitForText('Confirm your payment')
    I.click(buttons.confirm)
  }

  cancelPayment (): void {
    I.waitForText('Confirm your payment')
    I.click('Cancel payment')
  }

  goBackToService (): void {
    I.click(links.goBack)
  }
}
