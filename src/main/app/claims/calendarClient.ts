import { request } from 'client/request'
import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { MomentFormatter } from 'utils/momentFormatter'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class CalendarClient {
  constructor (
    private readonly url: string = `${claimApiBaseUrl}/calendar/next-working-day`
  ) {
  }

  getNextWorkingDay (date: Moment, addDays: number = 0): Promise<Moment> {
    if (!date) {
      return Promise.reject('Missing date')
    }

    const formattedDate: string = MomentFormatter.formatDate(date.add(addDays, 'day'))

    return request
      .get(`${this.url}?date=${formattedDate}`)
      .then(response => MomentFactory.parse(response.nextWorkingDay))
      .catch(error => {
        throw new Error(`Unable to get next working day - ${error}`)
      })
  }
}
