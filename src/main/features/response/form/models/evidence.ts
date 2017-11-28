import { ValidateNested } from 'class-validator'

import { EvidenceRow } from 'response/form/models/evidenceRow'

export const INIT_ROW_COUNT: number = 4
export const MAX_NUMBER_OF_ROWS: number = 20

export class Evidence {
  readonly type: string = 'breakdown'

  @ValidateNested({ each: true })
  rows: EvidenceRow[]

  constructor (rows: EvidenceRow[] = Evidence.initialRows()) {
    this.rows = rows
  }

  static fromObject (value?: any): Evidence {
    if (!value) {
      return value
    }

    return new Evidence(value.rows ? value.rows.map(EvidenceRow.fromObject) : [])
  }

  private static initialRows (rows: number = INIT_ROW_COUNT): EvidenceRow[] {
    return new Array(rows).fill(EvidenceRow.empty())
  }

  deserialize (input?: any): Evidence {
    if (input) {
      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  appendRow () {
    if (this.canAddMoreRows()) {
      this.rows.push(EvidenceRow.empty())
    }
  }

  removeExcessRows () {
    this.rows = this.rows.filter(item => !!item.type)

    if (this.rows.length === 0) {
      this.appendRow()
    }
  }

  canAddMoreRows () {
    return this.rows.length < MAX_NUMBER_OF_ROWS
  }

  private deserializeRows (rows: any): EvidenceRow[] {
    if (!rows) {
      return Evidence.initialRows()
    }

    let timelineRows: EvidenceRow[] = rows.map(row => new EvidenceRow().deserialize(row))

    if (rows.length < INIT_ROW_COUNT) {
      timelineRows = timelineRows.concat(Evidence.initialRows(INIT_ROW_COUNT - rows.length))
    }

    return timelineRows
  }

}
