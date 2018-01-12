import { MultiRowForm } from 'forms/models/multiRowForm'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'

export function makeSureThereIsAtLeastOneRow (model: MultiRowForm<MultiRowFormItem>): void {
  if (model && model.getPopulatedRowsOnly().length === 0) {
    model.appendRow()
  }
}
