import { EvidenceRow } from 'forms/models/evidenceRow'
import { MultiRowForm } from 'forms/models/multiRowForm'

export const INIT_ROW_COUNT: number = 4

export class Evidence extends MultiRowForm<EvidenceRow> {

  static fromObject (value?: any): Evidence {
    if (!value) {
      return value
    }

    return new Evidence(value.rows ? value.rows.map(EvidenceRow.fromObject) : [])
  }

  createEmptyRow (): EvidenceRow {
    return EvidenceRow.empty()
  }

  getInitialNumberOfRows (): number {
    return INIT_ROW_COUNT
  }

  isCompleted (): boolean {
    return !!this.rows
  }
}
