export class AllowanceItem {

  constructor (public item?: string, public weekly?: number, public monthly?: number) {
  }

  deserialize (input?: any): AllowanceItem {
    if (input) {
      this.item = input.item
      this.weekly = input.weekly
      this.monthly = input.monthly
    }
    return this
  }
}
