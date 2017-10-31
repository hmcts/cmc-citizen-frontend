export class YesNoOption {
  static readonly YES = new YesNoOption('yes')
  static readonly NO = new YesNoOption('no')

  readonly option: string

  constructor (option?: string) {
    this.option = option
  }

  static fromObject (input?: any): YesNoOption {
    if (!input) {
      return input
    }
    if (input === 'yes') {
      return YesNoOption.YES
    } else if (input === 'no') {
      return YesNoOption.NO
    } else {
      throw new Error(`Invalid YesNoOption value: ${JSON.stringify(input)}`)
    }
  }

  static all (): YesNoOption[] {
    return [
      YesNoOption.YES,
      YesNoOption.NO
    ]
  }
}
