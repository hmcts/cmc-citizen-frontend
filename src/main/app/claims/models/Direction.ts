import { Moment } from 'moment'
import * as _ from 'lodash'

export interface Direction {
  directionParty?: string
  directionType?: string
  directionHeaderType?: string
  directionActionedBy?: Moment
  directionComment?: string
  extraDocuments?: string[]
  expertReports?: string[]
}

export namespace Direction {
  export function deserialize (input: any): Direction[] {
    if (!input) {
      return input
    }

    let directions = []
    _.each(input, function (eachDirection) {
      directions.push({
        directionParty: eachDirection.directionParty,
        directionType: eachDirection.directionType,
        directionHeaderType: eachDirection.directionHeaderType,
        directionActionedBy: eachDirection.directionActionedBy,
        directionComment: eachDirection.directionHeaderType,
        extraDocuments: eachDirection.directionHeaderType
      })
    })

    return directions
  }
}
