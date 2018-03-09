import I = CodeceptJS.I

const I: I = actor()

const fields = {
  addressLine1: 'input[id="address[line1]"]',
  addressLine2: 'input[id="address[line2]"]',
  addressCity: 'input[id="address[city]"]',
  postcode: 'input[id="address[postcode]"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantAddressPage {

  enterAddress (address: Address): void {
    I.fillField(fields.addressLine1, address.line1)
    I.fillField(fields.addressLine2, address.line2)
    I.fillField(fields.addressCity, address.city)
    I.fillField(fields.postcode, address.postcode)

    I.click(buttons.submit)
  }
}
