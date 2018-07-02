/* tslint:disable variable-name allow snake_case */

import 'reflect-metadata'
import { plainToClass, Type } from 'class-transformer'

class Link {
  readonly href: string
  readonly method: string
}

class Links {
  @Type(() => Link)
  readonly self?: Link
  @Type(() => Link)
  readonly next_url: Link
}

export class Payment {
  reference: string
  amount?: number
  status: string // only in V2
  date_created?: number | string // V1 uses number, V2 uses ISO string, Payment response extends this which doesn't have a date_created
  @Type(() => Links)
  _links?: Links

  static deserialize (input?: any): Payment {
    return plainToClass(Payment, input as object)
  }
}
