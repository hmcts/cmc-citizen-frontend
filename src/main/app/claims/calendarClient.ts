import { request } from 'client/request'
import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { MomentFormatter } from 'utils/momentFormatter'
import { Moment } from 'moment'
import { MomentFactory } from 'shared/momentFactory'

export class CalendarClient {

  static getNextWorkingDay (date: Moment, addDays: number = 0): Promise<Moment> {
    const url: string = `${claimApiBaseUrl}/calendar/next-working-day`

    const formattedDate: string = MomentFormatter.formatDate(date.add(addDays, 'day'))

    return request.get(
      `${url}?date=${formattedDate}`
    ).then(response => MomentFactory.parse(response.nextWorkingDay))
  }
}
