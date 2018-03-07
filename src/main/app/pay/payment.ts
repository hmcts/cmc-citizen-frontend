import 'reflect-metadata'
import { Expose, Type} from 'class-transformer'
import { MoneyConverter } from 'fees/moneyConverter'

class NextURL {
  readonly href: string
  readonly method: string
}

class Links {
  @Expose({ name: 'next_url' })
  @Type(() => NextURL)
  readonly nextUrl: NextURL

  @Type(() => NextURL)
  readonly self: NextURL

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

  // static fromObject (input?: any): Payment {
  //   return new Payment().deserialize(input)
  // }

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
