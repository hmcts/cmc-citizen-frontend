import { Eligibility } from 'claim/form/models/eligibility/eligibility'
import * as Cookies from 'cookies'
import * as express from 'express'

const minuteInMilliseconds = 60 * 1000
const cookieTimeToLiveInMinutes = 10 * minuteInMilliseconds

export const cookieName = 'eligibility-check'

export interface EligibilityStore {
  read (req: express.Request, res: express.Response): Eligibility

  write (eligibility: Eligibility, req: express.Request, res: express.Response): void
}

export class CookieEligibilityStore implements EligibilityStore {

  read (req: express.Request, res: express.Response): Eligibility {
    const cookie: string = new Cookies(req, res).get(cookieName)
    return new Eligibility().deserialize(cookie !== undefined ? JSON.parse(cookie) : undefined)
  }

  write (eligibility: Eligibility, req: express.Request, res: express.Response): void {
    new Cookies(req, res).set(cookieName, JSON.stringify(eligibility), { sameSite: 'lax', maxAge: cookieTimeToLiveInMinutes })
  }
}
