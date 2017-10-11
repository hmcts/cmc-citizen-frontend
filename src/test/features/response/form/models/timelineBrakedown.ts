import { expect } from 'chai'

import { TimelineRow } from 'response/form/models/timelineRow'
import { INIT_ROW_COUNT, TimelineBreakdown } from 'response/form/models/timelineBreakdown'

describe('TimelineBreakdown', () => {

  describe('initialRows', () => {

    it('should return array of empty instances of TimelineRow', () => {

      const actual: TimelineRow[] = TimelineBreakdown.initialRows()

      expect(actual.length).to.equal(4)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    [false, null, undefined, 0, '', NaN].forEach(value => {
      it(`should return ${value} value when ${value} value provided`, () => {
        const actual: any = TimelineBreakdown.fromObject(value)

        expect(actual).to.eql(value)
      })
    })

    it('should return TimelineBreakdown with list of empty TimelineRow[] when empty input given', () => {
      const actual: TimelineBreakdown = TimelineBreakdown.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return TimelineBreakdown with first element on list populated', () => {
      const actual: TimelineBreakdown = TimelineBreakdown.fromObject({ rows: [{ date: 'May', description: 'OK' }] })

      const populatedItem: TimelineRow = actual.rows.pop()

      expect(populatedItem.date).to.eq('May')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return object with list of TimelineRow longer than default', () => {
      const actual: TimelineBreakdown = TimelineBreakdown.fromObject(
        {
          rows: [
            { date: 'Jan', description: 'OK' },
            { date: 'Feb', description: 'OK' },
            { date: 'Mar', description: 'OK' },
            { date: 'Apr', description: 'OK' },
            { date: 'May', description: 'OK' },
            { date: 'Jun', description: 'OK' }
          ]
        }
      )

      expect(actual.rows.length).to.be.greaterThan(INIT_ROW_COUNT)
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('deserialize', () => {

    it('should return valid TimelineBreakdown object with list of empty TimelineRow', () => {
      const actual: TimelineBreakdown = new TimelineBreakdown().deserialize({})

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return valid TimelineBreakdown object with populated first TimelineRow', () => {
      const actual: TimelineBreakdown = new TimelineBreakdown().deserialize(
        { rows: [{ date: 'May', description: 'OK' }] }
      )

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      const populatedItem: TimelineRow = actual.rows[0]

      expect(populatedItem.date).to.eq('May')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows.slice(1))
    })

    it('should return valid TimelineBreakdown object with list of row longer than default length', () => {
      const actual: TimelineBreakdown = new TimelineBreakdown().deserialize(
        {
          rows: [
            { date: 'Jan', description: 'OK' },
            { date: 'Feb', description: 'OK' },
            { date: 'Mar', description: 'OK' },
            { date: 'Apr', description: 'OK' },
            { date: 'May', description: 'OK' }
          ]
        }
      )

      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('appendRow', () => {

    it('adds empty element to list of rows', () => {
      const actual: TimelineBreakdown = new TimelineBreakdown()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      actual.appendRow()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT + 1)
    })
  })
})

function expectAllRowsToBeEmpty (rows: TimelineRow[]) {
  rows.forEach(item => {
    expect(item instanceof TimelineRow).to.eq(true)
    expect(item.date).to.eq(undefined)
    expect(item.description).to.eq(undefined)
  })
}

function expectAllRowsToBePopulated (rows: TimelineRow[]) {
  rows.forEach(item => {
    expect(!!item.date).to.eq(true)
    expect(!!item.description).to.eq(true)
  })
}
