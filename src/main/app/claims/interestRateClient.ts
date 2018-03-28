import { request } from 'client/request'
import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { MomentFormatter } from 'utils/momentFormatter'
import { Moment } from 'moment'
import { User } from 'idam/user'

export class InterestRateClient {

  static calculateInterestRate (amount: number, rate: number, startDate: Moment, endDate: Moment): Promise<number> {
    const url: string = `${claimApiBaseUrl}/interest/calculate`

    const from: string = MomentFormatter.formatDate(startDate)
    const to: string = MomentFormatter.formatDate(endDate)

    return request.get(
      `${url}?from_date=${from}&to_date=${to}&amount=${amount}&rate=${rate}`
    ).then(response => response.amount)
  }

  static calculateInterestRateForClaim (externalId: string, user: User): Promise<number> {
    if (!externalId || !user) {
      return Promise.reject(new Error('External id must be set and user must be set'))
    }

    return request
      .get(`${claimApiBaseUrl}/interest/calculate/${externalId}`, {
        headers: {
          Authorization: `Bearer ${user.bearerToken}`
        }
      }).then(response => response.amount)
  }
}
