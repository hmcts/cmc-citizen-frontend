import I = CodeceptJS.I

const I: I = actor()

const fields = {
  name: { css: 'input[id=name]' },
  addressLine1: { css: 'input[id="address[line1]"]' },
  addressLine2: { css: 'input[id="address[line2]"]' },
  addressCity: { css: 'input[id="address[city]"]' },
  postcode: { css: 'input[id="address[postcode]"]' }
}

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class DefendantNameAndAddressPage {

  enterName (name: string): void {
    I.fillField(fields.name, name)
  }

  enterAddress (address: Address): void {
    I.fillField(fields.addressLine1, address.line1)
    I.fillField(fields.addressLine2, address.line2)
    I.fillField(fields.addressCity, address.city)
    I.fillField(fields.postcode, address.postcode)

    I.click(buttons.submit)
  }
}
