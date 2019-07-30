import { MomentFactory } from 'shared/momentFactory'
import { expect } from 'chai'
import { CalendarClient } from 'claims/calendarClient'
import { mockNextWorkingDay, rejectNextWorkingDay } from 'test/http-mocks/claim-store'

describe('calendar', () => {
  const SATURDAY = MomentFactory.parse('2019-06-29')
  const MONDAY_AFTER = '2019-06-29'
  let calendarClient: CalendarClient

  beforeEach(() => {
    calendarClient = new CalendarClient()
  })

  it('should return correct date when calendar api is called', async () => {
    mockNextWorkingDay(SATURDAY)

    const nextWorkingDay = await calendarClient.getNextWorkingDay(SATURDAY)

    expect(nextWorkingDay.toISOString()).to.equal(MomentFactory.parse(MONDAY_AFTER).toISOString())
  })

  it('should return Invalid next working day', async () => {
    mockNextWorkingDay(undefined)

    calendarClient.getNextWorkingDay(SATURDAY)
      .then(undefined,
        rej => {
          expect(rej.toString()).to.contains('Invalid next working day')
        })
  })

  it('should return Missing date error when no date is passed - getNextWorkingDayAfterDays', () => {
    mockNextWorkingDay(SATURDAY)

    calendarClient.getNextWorkingDayAfterDays(undefined, 0)
      .then(undefined, rej =>
        expect(rej.toString()).to.contains('Missing date')
      )
  })

  it('should return Missing date error when no date is passed - getNextWorkingDay', () => {
    mockNextWorkingDay(SATURDAY)

    calendarClient.getNextWorkingDay(undefined)
      .then(undefined, rej =>
        expect(rej.toString()).to.contains('Missing date')
      )
  })

  it('should return Unable to get next working day bad request', () => {
    rejectNextWorkingDay(SATURDAY)

    calendarClient.getNextWorkingDay(SATURDAY)
      .catch(err =>
        expect(err.toString()).to.contains('Unable to get next working day')
      )
  })
})
