import * as config from 'config'
import * as express from 'express'
import * as _ from 'lodash'

import { Eligibility } from 'eligibility/model/eligibility'

const minuteInMilliseconds = 60 * 1000
const cookieTimeToLiveInMinutes = config.get<number>('eligibility.cookie.timeToLiveInMinutes') * minuteInMilliseconds

export const cookieName = 'eligibility-check'

export class CookieEligibilityStore {
  read (req: express.Request, res: express.Response): Eligibility {
    const cookie: string = req.cookies[cookieName]
    return new Eligibility().deserialize(cookie !== undefined ? cookie : undefined)
  }

  write (eligibility: Eligibility, req: express.Request, res: express.Response): void {
    const excludeDisplayValue = (value: any): any | undefined => {
      const property = 'displayValue'

      if (value && typeof value === 'object' && Object.getOwnPropertyDescriptor(value, property)) {
        return _.omit(value, property)
      }
      return undefined
    }
    res.cookie(cookieName, _.cloneDeepWith(eligibility, excludeDisplayValue), { httpOnly: true, secure: true, maxAge: cookieTimeToLiveInMinutes })
  }

  clear (req: express.Request, res: express.Response): void {
    res.clearCookie(cookieName)
  }
}
