import I = CodeceptJS.I

const I: I = actor()

const fields = {
  name: 'input[id=name]',
  address: {
    postcodeLookUp: 'input[id="address[postcodeLookup]"]',
    selectAddressList: 'select[id="address[addressList]"]',
    line1: 'input[id="address[line1]"]',
    line2: 'input[id="address[line2]"]',
    city: 'input[id="address[city]"]',
    postcode: 'input[id="address[postcode]"]',
    enterManually: 'a[id="address[enterManually]"]'
  },
  hasCorrespondenceAddress: 'input[id=hasCorrespondenceAddresstrue]',
  correspondenceAddress: {
    line1: 'input[id="correspondenceAddress[line1]"]',
    line2: 'input[id="correspondenceAddress[line2]"]',
    city: 'input[id="correspondenceAddress[city]"]',
    postcode: 'input[id="correspondenceAddress[postcode]"]',
    enterManually: 'a[id="correspondenceAddress[enterManually]"]'
  }
}

const buttons = {
  submit: 'input[type=submit]',
  postCodeLookUp: 'a[id="address[find-button]"]'
}

export class IndividualDetailsPage {

  open (type: string): void {
    I.amOnCitizenAppPage(`/claim/${type}-individual-details`)
  }

  enterName (name: string): void {
    I.fillField(fields.name, name)
  }

  enterAddress (address: Address): void {
    I.click(fields.address.enterManually)
    I.fillField(fields.address.line1, address.line1)
    I.fillField(fields.address.line2, address.line2)
    I.fillField(fields.address.postcode, address.postcode)
    I.fillField(fields.address.city, address.city)
  }

  enterAddressOnPostCodeLookUp (postCodeLookup): void {
    I.fillField(fields.address.postcodeLookUp, postCodeLookup.postCode)
    I.click(buttons.postCodeLookUp)
    I.waitForVisible(fields.address.selectAddressList)
    I.click(fields.address.selectAddressList)
    I.selectOption(fields.address.selectAddressList, postCodeLookup.selectedOption)
  }

  enterAddresses (address: Address, correspondenceAddress: Address): void {
    I.click(fields.address.enterManually)
    I.fillField(fields.address.line1, address.line1)
    I.fillField(fields.address.line2, address.line2)
    I.fillField(fields.address.city, address.city)
    I.fillField(fields.address.postcode, address.postcode)

    I.checkOption(fields.hasCorrespondenceAddress)

    I.click(fields.correspondenceAddress.enterManually)
    I.fillField(fields.correspondenceAddress.line1, correspondenceAddress.line1)
    I.fillField(fields.correspondenceAddress.line2, correspondenceAddress.line2)
    I.fillField(fields.correspondenceAddress.city, correspondenceAddress.city)
    I.fillField(fields.correspondenceAddress.postcode, correspondenceAddress.postcode)
  }

  submit (): void {
    I.click(buttons.submit)
  }

}
