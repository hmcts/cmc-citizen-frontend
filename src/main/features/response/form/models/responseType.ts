export class ResponseType {
  static readonly FULL_ADMISSION = new ResponseType('FULL_ADMISSION', 'I admit all of the claim')
  static readonly PART_ADMISSION = new ResponseType('PART_ADMISSION', 'I admit part of the claim')
  static readonly DEFENCE = new ResponseType('DEFENCE', 'I reject all of the claim')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): ResponseType[] {
    return [
      ResponseType.FULL_ADMISSION,
      ResponseType.PART_ADMISSION,
      ResponseType.DEFENCE
    ]
  }

  static except (responseType: ResponseType): ResponseType[] {
    if (responseType === undefined) {
      throw new Error('Response type is required')
    }
    return ResponseType.all().filter(item => item !== responseType)
  }

  static valueOf (value: string): ResponseType {
    return ResponseType.all().filter(item => item.value === value).pop()
  }
}
