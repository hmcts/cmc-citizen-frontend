import * as config from 'config'
import * as express from 'express'
import * as Cookies from 'cookies'
import * as _ from 'lodash'

import { Eligibility } from 'eligibility/model/eligibility'

const minuteInMilliseconds = 60 * 1000
const cookieTimeToLiveInMinutes = config.get<number>('eligibility.cookie.timeToLiveInMinutes') * minuteInMilliseconds

export const cookieName = 'eligibility-check'

export class CookieEligibilityStore {
  read (req: express.Request, res: express.Response): Eligibility {
    const cookie: string = new Cookies(req, res).get(cookieName)
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

    new Cookies(req, res).set(cookieName, JSON.stringify(_.cloneDeepWith(eligibility, excludeDisplayValue)), { sameSite: 'lax', maxAge: cookieTimeToLiveInMinutes })
  }

  clear (req: express.Request, res: express.Response): void {
    new Cookies(req, res).set(cookieName, '', { sameSite: 'lax' })
  }
}
