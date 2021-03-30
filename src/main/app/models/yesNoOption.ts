export class YesNoOption {
  static readonly YES = new YesNoOption('yes')
  static readonly NO = new YesNoOption('no')

  constructor (readonly option?: string) { }

  static fromObject (input?: any): YesNoOption {
    if (!input) {
      return input
    }
    if (input === 'yes') {
      return YesNoOption.YES
    } else if (input === 'no') {
      return YesNoOption.NO
    } else {
      return undefined
    }
  }

  static all (): YesNoOption[] {
    return [
      YesNoOption.YES,
      YesNoOption.NO
    ]
  }
}
