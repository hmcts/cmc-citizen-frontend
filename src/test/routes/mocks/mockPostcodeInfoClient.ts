import * as mock from 'mock-require'

mock('@hmcts/postcodeinfo-client', './mockPostcodeInfoClient')

export class PostcodeInfoClient {
  constructor (public readonly apikey: string, public readonly request?, apiLocation?) {
  }

  lookupPostcode (postcode) {
    if (postcode === 'fail') {
      return Promise.reject(new Error('Mocked failure'))
    }
    return Promise.resolve({ valid: false })
  }

}
