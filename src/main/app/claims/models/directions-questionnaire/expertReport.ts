import { LocalDate } from 'forms/models/localDate'

export interface ReportRow {
  expertName: string,
  expertReportDate: LocalDate
}

export interface ExpertReportRows {
  expertReports: ReportRow[]
}
