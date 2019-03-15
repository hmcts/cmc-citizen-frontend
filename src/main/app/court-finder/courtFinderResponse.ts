import { Court } from './court'

export class CourtFinderResponse {

  public courts: Court[] = []

  constructor (
    public readonly statusCode: number,
    public readonly valid: boolean
  ) {
  }

  public addAll (additionalCourts: Court[]) {
    this.courts.push(...additionalCourts)
  }
}
