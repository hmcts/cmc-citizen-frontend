import { request } from 'client/request'
import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { MomentFormatter } from 'utils/momentFormatter'
import { Moment } from 'moment'

export class InterestRateClient {

  static calculateInterestRate (amount: number, rate: number, startDate: Moment, endDate: Moment): Promise<number> {
    const url: string = `${claimApiBaseUrl}/interest/calculate`

    const from: string = MomentFormatter.formatDate(startDate)
    const to: string = MomentFormatter.formatDate(endDate)

    return request.get(
      `${url}?from_date=${from}&to_date=${to}&amount=${amount}&rate=${rate}`
    ).then(response => response.amount)
  }
}
