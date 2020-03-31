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

  getNextWorkingDayAfterDays (date: Moment, addDays: number): Promise<Moment> {
    if (!date) {
      return Promise.reject('Missing date')
    }

    return this.getNextWorkingDay(date.add(addDays, 'day'))
  }

  getNextWorkingDay (date: Moment): Promise<Moment> {
    if (!date) {
      return Promise.reject('Missing date')
    }

    const formattedDate: string = encodeURI(MomentFormatter.formatDate(date))
    return requestPromise
      .get({
        json: true,
        uri: `${this.url}?date=${formattedDate}`
      })
      .then(
        res => {
          if (!res.nextWorkingDay) {
            throw new Error('Invalid next working day')
          }

          return MomentFactory.parse(res.nextWorkingDay)
        }
      )
      .catch(error => {
        throw new Error(`Unable to get next working day - ${error}`)
      })
  }
}
