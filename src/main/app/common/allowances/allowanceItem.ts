export class AllowanceItem {
  item?: string
  weekly?: number
  monthly?: number

  constructor (item?: string, weekly?: number, monthly?: number) {
    this.item = item
    this.weekly = weekly
    this.monthly = monthly
  }

  static fromObject (value?: any): AllowanceItem {
    if (!value) {
      return value
    }

    return new AllowanceItem(
      value.item,
      value.weekly,
      value.monthly
    )
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
