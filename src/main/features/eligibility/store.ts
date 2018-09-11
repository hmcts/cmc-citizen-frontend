import * as express from 'express'
import * as _ from 'lodash'

import { Eligibility } from 'eligibility/model/eligibility'
import { CookieProperties } from 'shared/cookieProperties'

export const cookieName = 'eligibilityCheck'

export class CookieEligibilityStore {
  read (req: express.Request, res: express.Response): Eligibility {
    const cookie: string = req.signedCookies.eligibilityCheck
    return new Eligibility().deserialize(cookie !== undefined ? JSON.parse(cookie) : undefined)
  }

  write (eligibility: Eligibility, req: express.Request, res: express.Response): void {
    const excludeDisplayValue = (value: any): any | undefined => {
      const property = 'displayValue'

      if (value && typeof value === 'object' && Object.getOwnPropertyDescriptor(value, property)) {
        return _.omit(value, property)
      }
      return undefined
    }
    res.cookie(cookieName, JSON.stringify(_.cloneDeepWith(eligibility, excludeDisplayValue)), CookieProperties.getCookieParameters())
  }

  clear (req: express.Request, res: express.Response): void {
    res.cookie(cookieName, '', { sameSite: 'lax' })
  }
}
