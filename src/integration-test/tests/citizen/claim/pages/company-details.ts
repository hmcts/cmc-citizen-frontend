import I = CodeceptJS.I

const I: I = actor()

const fields = {
  name: 'input[id=name]',
  contactPerson: 'input[id=contactPerson]',
  address: {
    postcodeLookUp: 'input[id="address[postcodeLookup]"]',
    addressList: 'select[id="address[addressList]"]',
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
  lookupAddress: 'a[id="address[find-button]"]'
}

export class CompanyDetailsPage {

  open (type: string): void {
    I.amOnCitizenAppPage(`/claim/${type}-individual-details`)
  }

  enterContactPerson (contactPerson: string): void {
    I.fillField(fields.contactPerson, contactPerson)
  }

  enterCompanyName (name: string): void {
    I.fillField(fields.name, name)
  }

  enterAddress (address: Address, clickManualLink: boolean = true): void {
    if (clickManualLink) {
      I.click(fields.address.enterManually)
    }
    I.fillField(fields.address.line1, address.line1)
    I.fillField(fields.address.line2, address.line2)
    I.fillField(fields.address.city, address.city)
    I.fillField(fields.address.postcode, address.postcode)
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
