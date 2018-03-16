export class Interest {

  constructor (public type?: string, public rate?: number, public reason?: string, public option?: string) {}

  deserialize (input?: any): Interest {
    if (input) {
      this.type = input.type
      if (input.rate) {
        this.rate = input.rate
      }
      if (input.reason) {
        this.reason = input.reason
      }
      if (input.option) {
        this.option = input.option
      }
    }
    return this
  }

}
