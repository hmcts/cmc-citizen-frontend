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

export class Allowance {

  personal?: AllowanceItem[]
  dependant?: AllowanceItem[]
  pensioner?: AllowanceItem[]
  disability?: AllowanceItem[]

  constructor (personal?: AllowanceItem[],
               dependant?: AllowanceItem[],
               pensioner?: AllowanceItem[],
               disability?: AllowanceItem[]) {
    this.personal = personal
    this.dependant = dependant
    this.disability = disability
    this.pensioner = pensioner
  }

  static fromObject (value?: any): Allowance {
    if (!value) {
      return value
    }

    return new Allowance(
      value.personal && value.personal.map(source => AllowanceItem.fromObject(source))
        .filter(source => source !== undefined),
     value.dependant && value.dependant.map(source => AllowanceItem.fromObject(source))
        .filter(source => source !== undefined),
      value.pensioner && value.pensioner.map(source => AllowanceItem.fromObject(source))
        .filter(source => source !== undefined),
      value.disability && value.disability.map(source => AllowanceItem.fromObject(source))
        .filter(source => source !== undefined)
    )
  }

  deserialize (input?: any): Allowance {
    if (!input) {
      return input
    }
    this.personal = input.personal && this.deserializeAllowanceItem(input.personal)
    this.dependant = input.dependant && this.deserializeAllowanceItem(input.dependant)
    this.pensioner = input.pensioner && this.deserializeAllowanceItem(input.pensioner)
    this.disability = input.disability && this.deserializeAllowanceItem(input.disability)

    return this
  }

  private deserializeAllowanceItem (allowanceItem: any[]): AllowanceItem[] {
    if (!allowanceItem) {
      return allowanceItem
    }
    return allowanceItem.map(allowanceItem => new AllowanceItem().deserialize(allowanceItem))
  }
}
