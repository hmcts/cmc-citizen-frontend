import I = CodeceptJS.I

const I: I = actor()

const fields = {
  address: {
    line1: 'input[id="line1"]',
    line2: 'input[id="line2"]',
    city: 'input[id="city"]',
    postcode: 'input[id="postcode"]'
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class CitizenAddressPage {

  open (type: string): void {
    I.amOnCitizenAppPage(`/claim/${type}-address`)
  }

  enterAddress (address: Address): void {
    I.fillField(fields.address.line1, address.line1)
    I.fillField(fields.address.line2, address.line2)
    I.fillField(fields.address.city, address.city)
    I.fillField(fields.address.postcode, address.postcode)

    I.click(buttons.submit)
  }
}
