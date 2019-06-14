import { YesNoOption } from 'claims/models/response/core/yesNoOption'

export interface Witness {
  selfWitness: YesNoOption,
  noOfOtherWitness: number
}
