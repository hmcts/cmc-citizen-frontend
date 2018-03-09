import 'reflect-metadata'
import { Expose, Type } from 'class-transformer'
import { MoneyConverter } from 'fees/moneyConverter'

class Link {
  readonly href: string
  readonly method: string
}

class Links {
  @Expose({ name: 'next_url' })
  @Type(() => Link)
  readonly nextUrl: Link

  @Type(() => Link)
  readonly self: Link

}

export class Payment {

  reference: string

  @Expose({ name: 'date_created' })
  dateCreated: number

  status: string

  amount: number

  @Expose({ name: '_links' })
  @Type(() => Links)
  links: Links

  deserialize (input?: any): Payment {
    if (input) {
      this.reference = input.reference
      this.dateCreated = input.dateCreated
      this.status = input.status
      this.amount = MoneyConverter.convertPoundsToPennies(input.amount)
    }
    return this
  }
}
