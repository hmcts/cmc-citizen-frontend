import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { MomentFormatter } from 'utils/momentFormatter'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import * as requestPromise from 'request-promise-native'

export class CalendarClient {
  constructor (
    private readonly url: string = `${claimApiBaseUrl}/calendar/next-working-day`
  ) {
  }

  getNextWorkingDay (date: Moment, addDays: number = 0): Promise<Moment> {
    if (!date) {
      return Promise.reject('Missing date')
    }

    const formattedDate: string = encodeURI(MomentFormatter.formatDate(date.add(addDays, 'day')))
    return requestPromise
      .get({
        json: true,
        uri: `${this.url}?date=${formattedDate}`
      })
      .then(res => MomentFactory.parse(res.nextWorkingDay))
      .catch(error => {
        throw new Error(`Unable to get next working day - ${error}`)
      })
  }
}
