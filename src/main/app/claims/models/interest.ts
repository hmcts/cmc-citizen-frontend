export class Interest {

  constructor (public type?: string, public rate?: number, public reason?: string) {}

  deserialize (input?: any): Interest {
    if (input) {
      this.type = input.type
      if (input.rate) {
        this.rate = input.rate
      }
      if (input.reason) {
        this.reason = input.reason
      }
    }
    return this
  }

}
