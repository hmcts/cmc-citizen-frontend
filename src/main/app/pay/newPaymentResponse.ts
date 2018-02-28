class NextURL {
  constructor (public href: string, public method: string) {
    this.href = href
    this.method = method
  }
}

export class Links {
  // tslint:disable-next-line variable-name allow snake_case
  constructor (public next_url: NextURL) {
    this.next_url = next_url
  }
}

export class NewPaymentResponse {
  // tslint:disable-next-line variable-name allow snake_case
  constructor (public amount: number, public case_reference: string, public description: string, public return_url: string, public _links: Links) {
    this.amount = amount
    this.case_reference = case_reference
    this.description = description
    this.return_url = return_url
    this._links = _links
  }
}
