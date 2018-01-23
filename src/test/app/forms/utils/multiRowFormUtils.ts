import { expect } from 'chai'
import { Debts } from 'response/form/models/statement-of-means/debts'
import { DebtRow } from 'response/form/models/statement-of-means/debtRow'
import { makeSureThereIsAtLeastOneRow } from 'forms/utils/multiRowFormUtils'
import { Form } from 'forms/form'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'

describe('makeSureThereIsAtLeastOneRow', () => {

  describe('does nothing when', () => {

    it('there is more than 0 rows', () => {
      const model = new Debts(true, [new DebtRow('my card', 100, 10)])

      expect(model.rows.length).to.be.eq(1)

      makeSureThereIsAtLeastOneRow(model)

      expect(model.rows.length).to.be.eq(1)
    })

    it('model is undefined', () => {
      const form = Form.empty()

      makeSureThereIsAtLeastOneRow(form.model as MultiRowForm<MultiRowFormItem>)
    })
  })

  it('adds one row when there is an empty list', () => {
    const model = new Debts(true, undefined)
    model.removeExcessRows()

    expect(model.rows.length).to.be.eq(0)

    makeSureThereIsAtLeastOneRow(model)

    expect(model.rows.length).to.be.eq(1)
  })
})
