import { Moment } from 'moment'
import { CalendarClient } from 'claims/calendarClient'

export async function getNextWorkingDay (date: Moment, addDays: number = 0): Promise<Moment> {
  return CalendarClient.getNextWorkingDay(date.add(addDays, 'day'))
}
